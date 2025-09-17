"""
Flask application entry point
"""
import os
from app import create_app
from app.config import config

# Get environment
env = os.getenv('FLASK_ENV', 'development')
app = create_app(config.get(env, config['default']))

if __name__ == '__main__':
    # Validate configuration
    from app.config import Config
    errors = Config.validate_config()
    if errors:
        print("Configuration errors:")
        for error in errors:
            print(f"  - {error}")
        exit(1)
    
    # Run the application
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    
    print(f"Starting Trading Journal API on port {port}")
    print(f"Environment: {env}")
    print(f"Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
