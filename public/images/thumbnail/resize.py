import os, subprocess

for f in os.listdir("../home/"):
  if f.startswith("product") and f.endswith(".jpg"):
    print "converting " + f
    subprocess.call(["convert", "../home/"+f, "-resize", "36%", f])
