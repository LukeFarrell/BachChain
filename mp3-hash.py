from mutagen.easyid3 import EasyID3
from mp3hash import mp3hash
import sys

def hashAudio(songFileName):
    return mp3hash(songFileName)

def setHash(audioFile, hashValue):
    audioFile["barcode"] = hashValue
    audioFile.save()

def main(argv):
    fileName = argv[0]
    audioFile = EasyID3(fileName)
    hashValue = hashAudio(fileName)
    setHash(audioFile, hashValue)
    print(hashValue)

if __name__ == "__main__":
    try:
        main(sys.argv[1:])
    except:
        print("Please pass in the mp3 filename as an argument.")
