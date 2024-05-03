from bs4 import BeautifulSoup
import requests
from datetime import datetime, timezone, timedelta
from selenium import webdriver
import codechefContestTimeFinder

import subprocess

def codechefUpcomingContest():
    
    try:
        html_content = subprocess.check_output(['node', 'upcomingContestScrape.js'])

        soup = BeautifulSoup(html_content, 'lxml')

        upcoming_contests = soup.find_all("a")

        contest_info = []

        for contest in upcoming_contests:
            href_value = contest['href']
            dateAndTime = codechefContestTimeFinder.timeFinder(href_value)
            print(contest.text + '----' + dateAndTime)
            contest_info[contest.text] = dateAndTime

        return contest_info

    except Exception as e:
        
        print ({'message' : str(e)})