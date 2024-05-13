from bs4 import BeautifulSoup
import requests
from datetime import datetime, timezone, timedelta

def atcoderUpcomingContests():
    try:
        html_text = requests.get('https://atcoder.jp/contests/').text
        soup = BeautifulSoup(html_text, 'lxml')
        upcoming_contests_div = soup.find("div", id="contest-table-upcoming")

        all_links_div = upcoming_contests_div.find_all("a")

        contests = {}

        lastDateAndTime = ""

        for link in all_links_div:
            contest_id_link = link.get("href")
            if contest_id_link.startswith("/contests"):
                # continue
                contest_id = contest_id_link.split('/')[-1]
                contest_title = link.text
                contests[contest_id] = {lastDateAndTime, contest_title}
                
            else:
                # print(link.text)
                tmp = link.text
                date_string = tmp
                date_object = datetime.strptime(date_string, "%Y-%m-%d %H:%M:%S%z")
                epoch_seconds = int(date_object.timestamp())
                lastDateAndTime = epoch_seconds

        # for contestID, dateAndTime in contests.items():
        #     print (contestID, " : ", dateAndTime)
        
        return contests
    
    except Exception as e:
        return {"error" : str(e)}
    
