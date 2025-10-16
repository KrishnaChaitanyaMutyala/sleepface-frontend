#!/usr/bin/env python3
"""
Test script to verify pore size detection is working
"""
import requests
import json
import os

def test_pore_detection():
    """Test the pore size detection feature"""
    print("🧪 Testing Pore Size Detection...")
    
    # Use an existing image from the project
    test_image_path = "frontend/assets/icon.png"
    
    if not os.path.exists(test_image_path):
        print(f"❌ Test image not found: {test_image_path}")
        return
    
    try:
        # Test the analysis endpoint
        url = "http://localhost:8000/analyze"
        
        with open(test_image_path, 'rb') as f:
            files = {'file': ('test.jpg', f, 'image/jpeg')}
            data = {'user_id': 'test_user'}
            
            print("📤 Sending test image to backend...")
            response = requests.post(url, files=files, data=data)
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Analysis successful!")
                print(f"📊 Sleep Score: {result.get('sleep_score', 'N/A')}")
                print(f"📊 Skin Health Score: {result.get('skin_health_score', 'N/A')}")
                
                features = result.get('features', {})
                print(f"🔍 Features detected:")
                for feature, value in features.items():
                    print(f"  - {feature}: {value}")
                
                # Check if pore_size is present
                if 'pore_size' in features:
                    print("✅ Pore size detection is working!")
                    print(f"   Pore size score: {features['pore_size']}")
                else:
                    print("❌ Pore size detection is missing!")
                
                # Check if smart_summary is present
                if 'smart_summary' in result:
                    print("✅ Smart summary is working!")
                    smart_summary = result['smart_summary']
                    print(f"   Daily summary: {smart_summary.get('daily_summary', 'N/A')[:100]}...")
                    print(f"   Key insights: {len(smart_summary.get('key_insights', []))} insights")
                    print(f"   Recommendations: {len(smart_summary.get('recommendations', []))} recommendations")
                else:
                    print("❌ Smart summary is missing!")
                
            else:
                print(f"❌ Analysis failed with status {response.status_code}")
                print(f"Response: {response.text}")
                
    except Exception as e:
        print(f"❌ Error testing pore detection: {e}")
    
    finally:
        # Clean up test file
        if os.path.exists(test_image_path):
            os.remove(test_image_path)
            print("🧹 Cleaned up test file")

if __name__ == "__main__":
    test_pore_detection()
