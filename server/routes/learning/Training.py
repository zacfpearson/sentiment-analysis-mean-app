import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='3'
import re
import sys

import tensorflow_hub as hub
import numpy as np
import tensorflow as tf
from tensorflow import keras
import tensorflow_text

def sent(predictedSentiment):
    if np.argmax(predictedSentiment) == 0:
        return "Negative Sentiment"
    else:
        return "Positive Sentiment"
        

def main():
    arg1 = sys.argv[1]
    arg3 = sys.argv[2]
    arg4 = sys.argv[3]

    use = hub.load("https://tfhub.dev/google/universal-sentence-encoder-multilingual/3")

    model = keras.models.load_model('my_model.h5')

    emb_input = use([arg3])
    review_emb_input = tf.reshape(emb_input, [-1]).numpy()

    predictedSentiment = model.predict(emb_input)

    print(sent(predictedSentiment))
    sys.stdout.flush()


if __name__ == "__main__":
    main()
