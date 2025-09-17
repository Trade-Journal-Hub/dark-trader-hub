#!/usr/bin/env python3
"""
Firebase Security Rules Validation Script
Tests the security rules to ensure proper access controls
"""

import json
import sys
from pathlib import Path

def analyze_firestore_rules():
    """Analyze Firestore security rules for common vulnerabilities"""
    print("🔍 Analyzing Firestore Security Rules...")
    print("=" * 50)
    
    rules_file = Path("firestore.rules")
    if not rules_file.exists():
        print("❌ firestore.rules not found!")
        return False
    
    with open(rules_file, 'r') as f:
        rules_content = f.read()
    
    # Security checks
    security_checks = {
        "Authentication Required": "request.auth" in rules_content,
        "User Ownership Validation": "request.auth.uid" in rules_content,
        "Data Validation Functions": "isValid" in rules_content,
        "Rate Limiting Protection": "isWithinRateLimit" in rules_content or "isWithinUploadLimit" in rules_content,
        "Default Deny Rule": "allow read, write: if false" in rules_content,
        "No Open Access": "allow read, write: if true" not in rules_content,
        "Timestamp Validation": "timestamp" in rules_content,
        "Admin Controls": "isAdmin" in rules_content,
    }
    
    # Vulnerability checks
    vulnerability_checks = {
        "No Wildcard Access": "/{document=**}" not in rules_content or "if false" in rules_content,
        "No Test Mode Rules": "request.time <" not in rules_content,
        "No Anonymous Access": "request.auth == null" not in rules_content or "if false" in rules_content,
    }
    
    print("✅ Security Features:")
    for check, passed in security_checks.items():
        status = "✅" if passed else "❌"
        print(f"  {status} {check}")
    
    print("\n🛡️ Vulnerability Protection:")
    for check, passed in vulnerability_checks.items():
        status = "✅" if passed else "❌"
        print(f"  {status} {check}")
    
    # Calculate security score
    total_checks = len(security_checks) + len(vulnerability_checks)
    passed_checks = sum(security_checks.values()) + sum(vulnerability_checks.values())
    security_score = (passed_checks / total_checks) * 100
    
    print(f"\n📊 Security Score: {security_score:.1f}%")
    
    if security_score >= 90:
        print("✅ Excellent security configuration!")
    elif security_score >= 75:
        print("⚠️ Good security, but could be improved")
    else:
        print("❌ Security needs significant improvement")
    
    return security_score >= 75

def analyze_storage_rules():
    """Analyze Storage security rules for common vulnerabilities"""
    print("\n🔍 Analyzing Storage Security Rules...")
    print("=" * 50)
    
    rules_file = Path("storage.rules")
    if not rules_file.exists():
        print("❌ storage.rules not found!")
        return False
    
    with open(rules_file, 'r') as f:
        rules_content = f.read()
    
    # Security checks
    security_checks = {
        "Authentication Required": "request.auth" in rules_content,
        "User Ownership Validation": "request.auth.uid" in rules_content,
        "File Size Limits": "request.resource.size" in rules_content,
        "File Type Validation": "contentType" in rules_content,
        "Filename Validation": "isSafeFilename" in rules_content,
        "Path Traversal Protection": "\\.\\..*" in rules_content,
        "Default Deny Rule": "allow read, write: if false" in rules_content,
        "Upload Rate Limiting": "isWithinUploadLimit" in rules_content,
    }
    
    # Vulnerability checks
    vulnerability_checks = {
        "No Open Access": "allow read, write: if true" not in rules_content,
        "No Wildcard Write": "/{allPaths=**}" in rules_content and "if false" in rules_content,
        "Sensitive File Protection": "credentials" in rules_content and "secrets" in rules_content,
        "Extension Blocking": "\\.(key|pem|p12|json|env)" in rules_content,
    }
    
    print("✅ Security Features:")
    for check, passed in security_checks.items():
        status = "✅" if passed else "❌"
        print(f"  {status} {check}")
    
    print("\n🛡️ Vulnerability Protection:")
    for check, passed in vulnerability_checks.items():
        status = "✅" if passed else "❌"
        print(f"  {status} {check}")
    
    # Calculate security score
    total_checks = len(security_checks) + len(vulnerability_checks)
    passed_checks = sum(security_checks.values()) + sum(vulnerability_checks.values())
    security_score = (passed_checks / total_checks) * 100
    
    print(f"\n📊 Security Score: {security_score:.1f}%")
    
    if security_score >= 90:
        print("✅ Excellent security configuration!")
    elif security_score >= 75:
        print("⚠️ Good security, but could be improved")
    else:
        print("❌ Security needs significant improvement")
    
    return security_score >= 75

def generate_security_report():
    """Generate a comprehensive security report"""
    print("\n📋 Security Recommendations:")
    print("=" * 50)
    
    recommendations = [
        "✅ Enable Firebase App Check for additional protection",
        "✅ Set up monitoring and alerting for suspicious activity",
        "✅ Regularly review and update security rules",
        "✅ Implement proper error handling to avoid information leakage",
        "✅ Use Firebase Security Rules testing framework",
        "✅ Enable audit logging for all database operations",
        "✅ Implement proper session management",
        "✅ Regular security audits and penetration testing",
    ]
    
    for rec in recommendations:
        print(f"  {rec}")
    
    print("\n🔧 Testing Commands:")
    print("  # Test Firestore rules")
    print("  firebase emulators:start --only firestore")
    print("  firebase emulators:exec --only firestore 'npm test'")
    print("")
    print("  # Test Storage rules") 
    print("  firebase emulators:start --only storage")
    print("  firebase emulators:exec --only storage 'npm test'")

def main():
    """Main security validation function"""
    print("🛡️ Firebase Security Rules Validator")
    print("=" * 60)
    
    firestore_secure = analyze_firestore_rules()
    storage_secure = analyze_storage_rules()
    
    generate_security_report()
    
    print("\n" + "=" * 60)
    
    if firestore_secure and storage_secure:
        print("✅ Overall Security Status: SECURE")
        print("🚀 Your Firebase security rules are well-configured!")
        return True
    else:
        print("❌ Overall Security Status: NEEDS IMPROVEMENT")
        print("⚠️ Please address the security issues above before deploying!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
