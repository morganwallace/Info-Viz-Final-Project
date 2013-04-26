#Creates .CSV of This American Life podcast tags (num, name, date, tags)
    #data fromfrom http://www.thisamericanlife.org/radio-archives

    #Created by Morgan Wallace

from lxml import html

episodeNum=1
tagDict={}

##d=open('talTags.csv','wb')
##d.write('Tags,Count,Year\n')

parsedObj = html.parse("http://www.ravelry.com/designers/jared-flood?sort=projects")

name=parsedObj.xpath('//*[@class="photo_frame"]/div')
print(name)



##name=((name[name.find(":")+2:].encode("ascii","replace")).replace("?"," ")).strip()#clean the name of episode number, unicode text and extra spaces
##date = '"'+parsedObj.xpath('//*[@class="top-inner clearfix"]/div[2]/text()')[0]+'"'
##year=date[-5:-1]
##tags=parsedObj.xpath('//*[@class="tags"]/a/text()')
##nodups=[]
##for i in tags:
##    if i not in nodups:nodups.append(i)
##for i in nodups:
##    tagYear=i+year
##    if tagYear in tagDict.keys():
##        tagDict[tagYear][0]+=1
##    else:
##        tagDict[tagYear]=[1,i,year]
##
####        print(tagYear+": "+str(tagDict[tagYear]))
##
##episodeNum+=1
##for i in tagDict.keys():    
##    d.write(tagDict[i][1]+","+str(tagDict[i][0])+","+tagDict[i][2]+"\n")#tags counts and year
##d.close()
##print ("\nDone")
