import urllib.request
import urllib.parse
import urllib.robotparser
from bs4 import BeautifulSoup
import re


url= "http://www.ravelry.com/designers/jared-flood?sort=projects"
response = urllib.request.urlopen(url)

pattern_photo=re.compile(r'class="photo"*.?url[(](.*?)[)]')
photo_urls=re.findall(pattern_photo,response.read())
print(photo_urls)

##soup = BeautifulSoup(response.readall())


##
##photos=re.findall(pattern_photo,"\n".join(names))
##print(photos)
