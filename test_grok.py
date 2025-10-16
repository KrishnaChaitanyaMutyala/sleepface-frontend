#!/usr/bin/env python3
"""
Test script for Grok API integration
"""
import asyncio
import os
import sys
import time

# Add backend to path
sys.path.append('backend')

from llm_service import FlexibleLLMService

async def test_grok_api():
    """Test Grok API with sample data"""
    
    # Set up the service
    service = FlexibleLLMService()
    
    # Check available models
    available_models = service.get_available_models()
    print(f"Available models: {available_models}")
    
    # Sample analysis data
    analysis_data = {
        'sleep_score': 45,
        'skin_health_score': 44,
        'features': {
            'dark_circles': 54.4,
            'puffiness': 90.3,
            'brightness': 90.5,
            'wrinkles': 85.2,
            'texture': 78.1,
            'pore_size': 65.3
        },
        'routine': {
            'sleep_hours': 7.5,
            'water_intake': 8,
            'products': ['retinol', 'vitamin_c']
        },
        'confidence': 0.85
    }
    
    # Sample context
    context = f"""
    Analysis Date: 2025-09-17
    Sleep Score: {analysis_data['sleep_score']}/100
    Skin Health Score: {analysis_data['skin_health_score']}/100
    
    Feature Analysis:
    - Dark Circles: {analysis_data['features']['dark_circles']}/100
    - Puffiness: {analysis_data['features']['puffiness']}/100
    - Brightness: {analysis_data['features']['brightness']}/100
    - Wrinkles: {analysis_data['features']['wrinkles']}/100
    - Texture: {analysis_data['features']['texture']}/100
    - Pore Size: {analysis_data['features']['pore_size']}/100
    
    Daily Routine:
    - Sleep Hours: {analysis_data['routine']['sleep_hours']}
    - Water Intake: {analysis_data['routine']['water_intake']} glasses
    - Products Used: {', '.join(analysis_data['routine']['products'])}
    """
    
    print("🚀 Testing Grok API...")
    print(f"📊 Sample data: Sleep {analysis_data['sleep_score']}, Skin {analysis_data['skin_health_score']}")
    
    # Test the API
    start_time = time.time()
    
    try:
        result = await service.generate_smart_summary(analysis_data)
        
        end_time = time.time()
        response_time = end_time - start_time
        
        if result:
            print(f"✅ Success! Response time: {response_time:.2f} seconds")
            print(f"🤖 Model: {result.get('model', 'Unknown')}")
            print(f"📝 Summary preview: {result.get('summary', 'No summary')[:200]}...")
        else:
            print("❌ Failed to get response")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print(f"⏱️ Total time: {time.time() - start_time:.2f} seconds")

if __name__ == "__main__":
    # Check if API key is set
    if not os.getenv('XAI_API_KEY'):
        print("❌ Please set XAI_API_KEY environment variable")
        print("   export XAI_API_KEY='your-xai-api-key-here'")
        print("   Get your API key from: https://console.x.ai")
        sys.exit(1)
    
    # Run the test
    asyncio.run(test_grok_api())
