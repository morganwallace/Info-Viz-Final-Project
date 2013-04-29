#!usr/bin/python
##########    Runs in python2 not python3
import sys
from lxml import html
import re
import csv
from time import sleep
reload(sys)
sys.setdefaultencoding("utf-8")
############ FUNCTIONS ##############

#returns lxml object to parse
def webpage_setup(url): #Setup the document
	doc = html.parse(url).getroot()
	doc.make_links_absolute()
	return doc

#Crawls pattern pages for extra data
def get_pattern_info(url):
	doc=webpage_setup(url)

	#get name
	name=doc.xpath("//*[@class='show']/h2/text()")
	name=name[0].strip()
	
	#get rating
	rating=doc.xpath("//*[@class='pattern_summary']/div/[@class='rating-foreground inline_stars_rating']/@title")
# 	rating = rating[0][:-9][:5]
	print rating
	quit()

	
	#get category
	category=doc.xpath("//*[@class='category']/a/span[1]/text()")

	#get price
	try:
		price=doc.xpath("//*[@class='downloadable']/strong/text()") 
		price=price[0][:-4]#costs money
	except:price="Free"#free

	#get projects
	proj=doc.xpath('//*[@id="people_tab"]/a/strong/text()')
	
	if proj != []:proj=proj[0]
	else:proj=0
	return [category[0],price,proj,name,rating]
	
#Get url for each page of designer
def designer_pages(designer):
	

	parse_and_save(url) ## sends the newly concatenated url to the parsing and saving function


#PARSING FUNCTION 
def parse_and_save(url):
	doc=webpage_setup(url)
	
	#Get Designer's Name
	designer=doc.xpath("//*[@class='profile']/h1/text()")[0].strip()
	print ("Parsing "+designer+"'s page:\t"+url+"\n")
	
	#get project links
	links=doc.xpath("//*[@class='pattern_name']/a/@href")
	
	#get photo urls
	photo_url = doc.xpath("//*[@class='photo']/@style")
	photos=re.findall(r"url[(]'(.*?)'"," ".join(photo_url))  #extract the url from the background-image style
	
	#get hearts
	hearts=doc.xpath("//*[@class='icon_indicator indicator']/text()")

	for i in range(len(hearts)):
		hearts[i]=int(hearts[i].strip()) #formats numbers of hearts as number rather than string
		
	#crawl the pattern page FOR categories and price
	categories=[]
	prices=[] 
	projects=[]
	names=[]
	ratings=[]
	for link in links:
		print("Crawling: "+link)
		pattern_crawl=get_pattern_info(link)
		categories.append(pattern_crawl[0])
		prices.append(pattern_crawl[1])
		projects.append(pattern_crawl[2])
		names.append(pattern_crawl[3])
		ratings.append(pattern_crawl[4])
	 	sleep(0)	#make the crawler polite - sleep(1) sec
	#Save
	print('names: '+str(len(names))+'  hearts: '+str(len(hearts))+'  links: '+str(len(links))+'  photos: '+str(len(photos))+'  projects: '+str(len(projects))+'  categories: '+str(len(categories))+'  prices: '+str(len(prices))+'  rating: '+str(len(ratings)))
	for i in range(len(names)):
		csvFile.writerow([designer, names[i], links[i], photos[i], categories[i], prices[i], projects[i], hearts[i], ratings[i]])
	#Check for extra pages
	extraPages=doc.xpath("//*[@class='next_page']/@href")
	if extraPages:
		parse_and_save(extraPages[0])




############ INITIALIZERS ##############
designerList=["Rebecca Danger","Cookie A","Stephen West","Jared Flood","Ysolda Teague"]
# urls = ['http://www.ravelry.com/designers/jared-flood?so\rt=projects',"http://www.ravelry.com/designers/Ysolda-Teague?sort=projects","http://www.ravelry.com/designers/Rebecca-Danger?sort=projects","http://www.ravelry.com/designers/Cookie-A?sort=projects","http://www.ravelry.com/designers/stephen-west?sort=projects"]


###########  Setup Export to CSV  ###########

#setup CSV file
f=open('test4.csv','wb')
csvFile=csv.writer(f)

#Add Header
csvFile.writerow(["Designer", "Name", "Link", "Photo", "Category", "Price", "Projects", "Hearts","Rating"])


###########  MAIN  ############# 
for des in designerList:
	print("\n\n"+des+":\n")
	parse_and_save("http://www.ravelry.com/designers/"+des.replace(" ","-")+"?page=1&sort=projects")

f.close()
