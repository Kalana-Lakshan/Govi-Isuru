import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models
from sklearn.utils import class_weight # <--- New Import
import numpy as np
import os

base_dir = 'dataset'
img_height = 224
img_width = 224
batch_size = 32

# 1. More Aggressive Augmentation (Helps with small data)
train_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    rotation_range=40,      # Increased rotation
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

train_generator = train_datagen.flow_from_directory(
    base_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='categorical',
    subset='training',
    shuffle=True # Important: Shuffle so it doesn't learn order
)

validation_generator = train_datagen.flow_from_directory(
    base_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='categorical',
    subset='validation'
)

# 2. Calculate Class Weights (The Bias Fix)
# This tells the model: "If you get a rare disease wrong, it counts as a BIG error."
class_weights = class_weight.compute_class_weight(
    class_weight='balanced',
    classes=np.unique(train_generator.classes),
    y=train_generator.classes
)
class_weights_dict = dict(enumerate(class_weights))
print("⚖️ Calculated Class Weights:", class_weights_dict)

# 3. Build a Smarter Model (Transfer Learning)
# Instead of building from scratch, let's use MobileNetV2 (Pre-trained on millions of images)
# It already knows what 'edges' and 'shapes' look like.
base_model = tf.keras.applications.MobileNetV2(input_shape=(224, 224, 3),
                                               include_top=False,
                                               weights='imagenet')
base_model.trainable = False # Freeze the base

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.2),
    layers.Dense(3, activation='softmax')
])

model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001), # Slower learning rate for better accuracy
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# 4. Train with Weights
print("🚀 Retraining with Bias Fix...")
history = model.fit(
    train_generator,
    epochs=15, # Increased epochs
    validation_data=validation_generator,
    class_weight=class_weights_dict # <--- Applying the fix here
)

model.save('rice_model_v2.h5')
print("✅ New Balanced Model Saved as 'rice_model_v2.h5'")