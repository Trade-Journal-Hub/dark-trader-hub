"""
Payment Routes
Handles Stripe payment processing and subscription management
"""
from flask import Blueprint, request, jsonify, current_app
import stripe
import os
from datetime import datetime
from typing import Dict, Any, List

# Initialize Blueprint
payment_bp = Blueprint('payment', __name__, url_prefix='/api/payments')

# Initialize Stripe
def init_stripe():
    """Initialize Stripe with secret key."""
    stripe_secret_key = os.getenv('STRIPE_SECRET_KEY')
    if stripe_secret_key:
        stripe.api_key = stripe_secret_key
        return True
    else:
        current_app.logger.warning("Stripe secret key not found, payment processing disabled")
        return False

# Check if Stripe is available
stripe_available = init_stripe()

@payment_bp.route('/plans', methods=['GET'])
def get_subscription_plans():
    """Get available subscription plans."""
    try:
        if not stripe_available:
            # Return mock plans if Stripe is not available
            return jsonify({
                "success": True,
                "data": [
                    {
                        "id": "basic",
                        "name": "Basic Plan",
                        "price": 9.99,
                        "currency": "usd",
                        "interval": "month",
                        "features": [
                            "Up to 100 trades per month",
                            "Basic analytics",
                            "Email support"
                        ],
                        "stripe_price_id": "price_basic_monthly"
                    },
                    {
                        "id": "professional",
                        "name": "Professional Plan",
                        "price": 29.99,
                        "currency": "usd",
                        "interval": "month",
                        "features": [
                            "Unlimited trades",
                            "Advanced analytics",
                            "File upload support",
                            "Priority support"
                        ],
                        "stripe_price_id": "price_professional_monthly"
                    },
                    {
                        "id": "enterprise",
                        "name": "Enterprise Plan",
                        "price": 99.99,
                        "currency": "usd",
                        "interval": "month",
                        "features": [
                            "Everything in Professional",
                            "Custom integrations",
                            "Dedicated support",
                            "Advanced reporting"
                        ],
                        "stripe_price_id": "price_enterprise_monthly"
                    }
                ]
            })
        
        # Fetch plans from Stripe
        prices = stripe.Price.list(active=True, expand=['data.product'])
        
        plans = []
        for price in prices.data:
            product = price.product
            plans.append({
                "id": product.id,
                "name": product.name,
                "price": price.unit_amount / 100,  # Convert from cents
                "currency": price.currency,
                "interval": price.recurring.interval if price.recurring else "one_time",
                "features": product.metadata.get('features', '').split(',') if product.metadata.get('features') else [],
                "stripe_price_id": price.id
            })
        
        return jsonify({
            "success": True,
            "data": plans
        })
        
    except Exception as e:
        current_app.logger.error(f"Error fetching subscription plans: {e}")
        return jsonify({
            "success": False,
            "error": "Failed to fetch subscription plans"
        }), 500

@payment_bp.route('/create-intent', methods=['POST'])
def create_payment_intent():
    """Create a payment intent for subscription."""
    try:
        data = request.get_json()
        plan_id = data.get('plan_id')
        customer_id = data.get('customer_id')
        
        if not plan_id:
            return jsonify({
                "success": False,
                "error": "Plan ID is required"
            }), 400
        
        if not stripe_available:
            # Return mock payment intent for development
            return jsonify({
                "success": True,
                "data": {
                    "id": "pi_mock_payment_intent",
                    "amount": 2999,  # $29.99 in cents
                    "currency": "usd",
                    "status": "requires_payment_method",
                    "client_secret": "pi_mock_payment_intent_secret_mock"
                }
            })
        
        # Get plan details
        plan = get_plan_by_id(plan_id)
        if not plan:
            return jsonify({
                "success": False,
                "error": "Invalid plan ID"
            }), 400
        
        # Create or get customer
        if customer_id:
            customer = stripe.Customer.retrieve(customer_id)
        else:
            customer = stripe.Customer.create(
                email=request.headers.get('X-User-Email', 'user@example.com')
            )
        
        # Create payment intent
        intent = stripe.PaymentIntent.create(
            amount=int(plan['price'] * 100),  # Convert to cents
            currency=plan['currency'],
            customer=customer.id,
            metadata={
                'plan_id': plan_id,
                'user_id': request.headers.get('X-User-ID', 'unknown')
            }
        )
        
        return jsonify({
            "success": True,
            "data": {
                "id": intent.id,
                "amount": intent.amount,
                "currency": intent.currency,
                "status": intent.status,
                "client_secret": intent.client_secret
            }
        })
        
    except Exception as e:
        current_app.logger.error(f"Error creating payment intent: {e}")
        return jsonify({
            "success": False,
            "error": "Failed to create payment intent"
        }), 500

@payment_bp.route('/create-portal-session', methods=['POST'])
def create_customer_portal_session():
    """Create a customer portal session for subscription management."""
    try:
        data = request.get_json()
        customer_id = data.get('customer_id')
        
        if not customer_id:
            return jsonify({
                "success": False,
                "error": "Customer ID is required"
            }), 400
        
        if not stripe_available:
            # Return mock portal URL for development
            return jsonify({
                "success": True,
                "data": {
                    "url": "https://billing.stripe.com/mock-portal-session"
                }
            })
        
        # Create portal session
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=request.headers.get('Origin', 'http://localhost:5173')
        )
        
        return jsonify({
            "success": True,
            "data": {
                "url": session.url
            }
        })
        
    except Exception as e:
        current_app.logger.error(f"Error creating portal session: {e}")
        return jsonify({
            "success": False,
            "error": "Failed to create portal session"
        }), 500

@payment_bp.route('/success', methods=['POST'])
def handle_payment_success():
    """Handle successful payment."""
    try:
        data = request.get_json()
        payment_intent_id = data.get('payment_intent_id')
        
        if not payment_intent_id:
            return jsonify({
                "success": False,
                "error": "Payment intent ID is required"
            }), 400
        
        if not stripe_available:
            # Mock success handling
            current_app.logger.info(f"Mock payment success for intent: {payment_intent_id}")
            return jsonify({
                "success": True,
                "message": "Payment processed successfully"
            })
        
        # Retrieve payment intent
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if intent.status == 'succeeded':
            # Update user subscription in database
            user_id = intent.metadata.get('user_id')
            plan_id = intent.metadata.get('plan_id')
            
            if user_id and plan_id:
                # Update user subscription status
                update_user_subscription(user_id, plan_id, 'active')
                
                current_app.logger.info(f"Subscription updated for user {user_id} to plan {plan_id}")
        
        return jsonify({
            "success": True,
            "message": "Payment processed successfully"
        })
        
    except Exception as e:
        current_app.logger.error(f"Error handling payment success: {e}")
        return jsonify({
            "success": False,
            "error": "Failed to process payment success"
        }), 500

@payment_bp.route('/failure', methods=['POST'])
def handle_payment_failure():
    """Handle failed payment."""
    try:
        data = request.get_json()
        payment_intent_id = data.get('payment_intent_id')
        error_message = data.get('error')
        
        if not payment_intent_id:
            return jsonify({
                "success": False,
                "error": "Payment intent ID is required"
            }), 400
        
        current_app.logger.error(f"Payment failed for intent {payment_intent_id}: {error_message}")
        
        return jsonify({
            "success": True,
            "message": "Payment failure logged"
        })
        
    except Exception as e:
        current_app.logger.error(f"Error handling payment failure: {e}")
        return jsonify({
            "success": False,
            "error": "Failed to process payment failure"
        }), 500

@payment_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhooks."""
    try:
        payload = request.get_data()
        sig_header = request.headers.get('Stripe-Signature')
        
        if not stripe_available:
            return jsonify({"success": True, "message": "Webhook received (mock mode)"})
        
        # Verify webhook signature
        webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
        if webhook_secret:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        else:
            current_app.logger.warning("Stripe webhook secret not configured")
            return jsonify({"success": False, "error": "Webhook secret not configured"}), 400
        
        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            current_app.logger.info(f"Payment succeeded: {payment_intent['id']}")
            
        elif event['type'] == 'customer.subscription.updated':
            subscription = event['data']['object']
            current_app.logger.info(f"Subscription updated: {subscription['id']}")
            
        elif event['type'] == 'customer.subscription.deleted':
            subscription = event['data']['object']
            current_app.logger.info(f"Subscription cancelled: {subscription['id']}")
        
        return jsonify({"success": True, "message": "Webhook processed"})
        
    except Exception as e:
        current_app.logger.error(f"Webhook error: {e}")
        return jsonify({"success": False, "error": "Webhook processing failed"}), 400

def get_plan_by_id(plan_id: str) -> Dict[str, Any]:
    """Get plan details by ID."""
    plans = {
        'basic': {
            'id': 'basic',
            'name': 'Basic Plan',
            'price': 9.99,
            'currency': 'usd'
        },
        'professional': {
            'id': 'professional',
            'name': 'Professional Plan',
            'price': 29.99,
            'currency': 'usd'
        },
        'enterprise': {
            'id': 'enterprise',
            'name': 'Enterprise Plan',
            'price': 99.99,
            'currency': 'usd'
        }
    }
    
    return plans.get(plan_id)

def update_user_subscription(user_id: str, plan_id: str, status: str):
    """Update user subscription in database."""
    try:
        # This would typically update Firestore or your database
        current_app.logger.info(f"Updating subscription for user {user_id}: plan={plan_id}, status={status}")
        
        # Mock database update
        # In real implementation, update Firestore document
        # db.collection('users').document(user_id).update({
        #     'subscription': {
        #         'plan': plan_id,
        #         'status': status,
        #         'updated_at': datetime.utcnow()
        #     }
        # })
        
    except Exception as e:
        current_app.logger.error(f"Failed to update user subscription: {e}")
        raise
