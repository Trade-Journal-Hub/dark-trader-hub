#!/usr/bin/env python3
"""
SEO Verification Script
Validates SEO implementation and provides optimization recommendations
"""

import requests
import xml.etree.ElementTree as ET
from urllib.parse import urljoin
import json

def check_site_accessibility(url):
    """Check if the site is accessible and returns proper response"""
    try:
        response = requests.get(url, timeout=10)
        print(f"✅ Site Response: {response.status_code}")
        
        if response.status_code == 200:
            print(f"✅ Content Length: {len(response.text)} characters")
            return response.text
        else:
            print(f"❌ Site returned status code: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Site accessibility error: {e}")
        return None

def validate_meta_tags(html_content):
    """Validate essential meta tags"""
    print("\n🔍 Validating Meta Tags:")
    
    meta_checks = {
        '<title>': 'Page Title',
        'name="description"': 'Meta Description', 
        'name="keywords"': 'Meta Keywords',
        'property="og:title"': 'Open Graph Title',
        'property="og:description"': 'Open Graph Description',
        'property="og:image"': 'Open Graph Image',
        'name="twitter:card"': 'Twitter Card',
        'rel="canonical"': 'Canonical URL',
        'application/ld+json': 'Structured Data',
    }
    
    for tag, description in meta_checks.items():
        if tag in html_content:
            print(f"  ✅ {description}")
        else:
            print(f"  ❌ {description}")

def check_sitemap(base_url):
    """Check sitemap accessibility and structure"""
    print("\n🗺️ Validating Sitemap:")
    
    sitemap_url = urljoin(base_url, '/sitemap.xml')
    try:
        response = requests.get(sitemap_url, timeout=10)
        if response.status_code == 200:
            print("✅ Sitemap accessible")
            
            # Parse XML
            root = ET.fromstring(response.content)
            urls = root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}url')
            print(f"✅ Sitemap contains {len(urls)} URLs")
            
            # List URLs
            for url in urls[:5]:  # Show first 5
                loc = url.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')
                if loc is not None:
                    print(f"  📄 {loc.text}")
            
            if len(urls) > 5:
                print(f"  ... and {len(urls) - 5} more URLs")
                
        else:
            print(f"❌ Sitemap not accessible: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Sitemap error: {e}")

def check_robots_txt(base_url):
    """Check robots.txt file"""
    print("\n🤖 Validating Robots.txt:")
    
    robots_url = urljoin(base_url, '/robots.txt')
    try:
        response = requests.get(robots_url, timeout=10)
        if response.status_code == 200:
            print("✅ Robots.txt accessible")
            
            content = response.text
            if 'Sitemap:' in content:
                print("✅ Sitemap reference found")
            if 'User-agent:' in content:
                print("✅ User-agent directives found")
            if 'Disallow:' in content:
                print("✅ Disallow directives found")
                
        else:
            print(f"❌ Robots.txt not accessible: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Robots.txt error: {e}")

def analyze_performance(html_content):
    """Analyze page performance indicators"""
    print("\n⚡ Performance Analysis:")
    
    performance_checks = {
        'preconnect': 'DNS Preconnect',
        'dns-prefetch': 'DNS Prefetch',
        'rel="manifest"': 'Web App Manifest',
        'theme-color': 'Theme Color',
        'viewport': 'Mobile Viewport',
    }
    
    for check, description in performance_checks.items():
        if check in html_content:
            print(f"  ✅ {description}")
        else:
            print(f"  ❌ {description}")

def generate_seo_report(base_url):
    """Generate comprehensive SEO report"""
    print(f"🔍 SEO Analysis for: {base_url}")
    print("=" * 60)
    
    # Check site accessibility
    html_content = check_site_accessibility(base_url)
    
    if html_content:
        # Validate meta tags
        validate_meta_tags(html_content)
        
        # Analyze performance
        analyze_performance(html_content)
        
        # Check if it's showing the actual app (not Firebase setup page)
        if 'Trading Journal Hub' in html_content:
            print("\n✅ SITE STATUS: Your trading journal app is live!")
        elif 'Firebase Hosting Setup Complete' in html_content:
            print("\n❌ SITE STATUS: Still showing Firebase setup page")
        else:
            print("\n⚠️ SITE STATUS: Unknown content detected")
    
    # Check supporting files
    check_sitemap(base_url)
    check_robots_txt(base_url)
    
    # SEO Recommendations
    print("\n📈 SEO Recommendations:")
    print("  ✅ Submit sitemap to Google Search Console")
    print("  ✅ Set up Google Analytics for tracking")
    print("  ✅ Monitor Core Web Vitals")
    print("  ✅ Add more high-quality content pages")
    print("  ✅ Implement internal linking strategy")
    print("  ✅ Optimize images with alt tags")
    print("  ✅ Add blog/content section for SEO")

def main():
    """Main SEO verification function"""
    base_url = "https://tradejournalhub-2d1d4.web.app"
    generate_seo_report(base_url)
    
    print("\n" + "=" * 60)
    print("✅ SEO Analysis Complete!")
    print(f"🌐 Your app: {base_url}")

if __name__ == "__main__":
    main()
