import tensorflow as tf

print("Tensorflow Version: ", tf.__version__)

gpus = tf.config.list_physical_devices('GPU')

if gpus:
    print("GPU is available: ", gpus)
else:
    print("GPU is not available")