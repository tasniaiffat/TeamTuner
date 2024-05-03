import subprocess
from bs4 import BeautifulSoup
import requests
from datetime import datetime, timezone, timedelta
from selenium import webdriver
import re

def timeFinder(url):

    html_content_soup = subprocess.check_output(['node', 'contestTimeScrape.js', url])

    soup = BeautifulSoup(html_content_soup, 'lxml')

    html_content = str(soup)

    pattern = r'Start Date: (.+?) at \d{2}:\d{2} HRS \(IST\)'

    matches = re.findall(pattern, html_content)

    if matches:
        start_date_time = matches[0]
        start_date_time = start_date_time.replace('</strong>', '')
        # print(start_date_time)
        return start_date_time
    
    else:
        return "Start Date and Time Not Declared."
