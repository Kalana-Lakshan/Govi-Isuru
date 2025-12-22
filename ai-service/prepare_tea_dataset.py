"""
Tea Dataset Preprocessing Script
Converts YOLO format dataset to classification format for training
"""

import os
import shutil
from pathlib import Path
import yaml

# Configuration
SOURCE_DATASET = "../Tea Dataset/Dataset 01"  # Using Dataset 01 with 5 classes
TARGET_DATASET = "tea_dataset"

def load_class_names(yaml_path):
    """Load class names from data.yaml"""
    with open(yaml_path, 'r') as f:
        data = yaml.safe_load(f)
    return data['names']

def prepare_classification_dataset():
    """
    Convert YOLO object detection dataset to classification dataset
    Since we're doing whole-image classification, we'll organize images by their labels
    """
    print("=" * 60)
    print("🍵 Tea Dataset Preparation")
    print("=" * 60)
    
    # Load class names
    yaml_path = os.path.join(SOURCE_DATASET, "data.yaml")
    class_names = load_class_names(yaml_path)
    print(f"📋 Classes found: {class_names}")
    
    # Create target directories
    for split in ['train', 'valid', 'test']:
        for class_name in class_names:
            # Clean class name for folder
            clean_name = class_name.replace(' ', '_').title()
            target_dir = os.path.join(TARGET_DATASET, split, clean_name)
            os.makedirs(target_dir, exist_ok=True)
    
    # Process each split
    for split in ['train', 'valid', 'test']:
        print(f"\n📁 Processing {split} split...")
        
        images_dir = os.path.join(SOURCE_DATASET, split, "images")
        labels_dir = os.path.join(SOURCE_DATASET, split, "labels")
        
        if not os.path.exists(images_dir):
            print(f"  ⚠️ Images directory not found: {images_dir}")
            continue
        
        # Get all images
        image_files = [f for f in os.listdir(images_dir) 
                      if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        
        print(f"  📷 Found {len(image_files)} images")
        
        # Class counters
        class_counts = {name: 0 for name in class_names}
        
        for img_file in image_files:
            # Get corresponding label file
            label_file = os.path.splitext(img_file)[0] + '.txt'
            label_path = os.path.join(labels_dir, label_file)
            
            # Determine class from label
            if os.path.exists(label_path):
                with open(label_path, 'r') as f:
                    lines = f.readlines()
                
                if lines:
                    # Get the first object's class (for whole-image classification)
                    # YOLO format: class_id x_center y_center width height
                    first_line = lines[0].strip().split()
                    if first_line:
                        class_idx = int(first_line[0])
                        class_name = class_names[class_idx]
                        clean_name = class_name.replace(' ', '_').title()
                        
                        # Copy image to target directory
                        src_path = os.path.join(images_dir, img_file)
                        dst_path = os.path.join(TARGET_DATASET, split, clean_name, img_file)
                        
                        shutil.copy2(src_path, dst_path)
                        class_counts[class_name] += 1
        
        # Print statistics
        print(f"\n  📊 {split} split statistics:")
        for class_name, count in class_counts.items():
            print(f"     {class_name}: {count} images")
    
    print("\n✅ Dataset preparation complete!")
    print(f"📁 Output directory: {TARGET_DATASET}")
    
    return class_names

if __name__ == "__main__":
    prepare_classification_dataset()
