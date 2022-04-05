import requests
from bs4 import BeautifulSoup
import json

# VPN UK so that all titles/descriptions etc will be in English
URLs = [   
    'https://www.imdb.com/title/tt2741602/?ref_=fn_al_tt_1',  # The Blacklist    
    'https://www.imdb.com/title/tt1442437/?ref_=fn_al_tt_1',  # Modern Family
    'https://www.imdb.com/title/tt1839578/?ref_=fn_al_tt_1',  # Person of Interest
    'https://www.imdb.com/title/tt6470478/?ref_=fn_al_tt_1',  # The Good Doctor
    'https://www.imdb.com/title/tt1475582/?ref_=fn_al_tt_1',  # Sherlock
    'https://www.imdb.com/title/tt5511582/?ref_=fn_al_tt_1',  # Timeless
    'https://www.imdb.com/title/tt1843230/?ref_=fn_al_tt_1',  # Once Upon a Time
    'https://www.imdb.com/title/tt2575988/?ref_=nv_sr_srsg_0',  # Silicon Valley
    'https://www.imdb.com/title/tt2467372/?ref_=nv_sr_srsg_0',  # Brooklyn Nine-Nine
    'https://www.imdb.com/title/tt1632701/?ref_=fn_al_tt_1',  # Suits
    'https://www.imdb.com/title/tt8420184/?ref_=fn_al_tt_1',  # The Last Dance
    'https://www.imdb.com/title/tt0386676/?ref_=fn_al_tt_1',  # The Office,
    'https://www.imdb.com/title/tt5753856/?ref_=nv_sr_srsg_6',  # Dark
    'https://www.imdb.com/title/tt6468322/?ref_=fn_al_tt_1',  # La casa de Papel
    'https://www.imdb.com/title/tt0108778/?ref_=fn_al_tt_1',  # Friends,
    'https://www.imdb.com/title/tt2442560/?ref_=fn_al_tt_1',  # Peaky Blinders
    'https://www.imdb.com/title/tt10986410/?ref_=fn_al_tt_1',  # Ted Lasso,
    'https://www.imdb.com/title/tt3825328/?ref_=nv_sr_srsg_7',  # Bajo Sospecha
    'https://www.imdb.com/title/tt0158552/?ref_=nv_sr_srsg_0',  # Charmed
    'https://www.imdb.com/title/tt0321021/?ref_=nv_sr_srsg_0',  # Without a Trace
    'https://www.imdb.com/title/tt4955642/?ref_=fn_al_tt_1',  # The Good Place
    'https://www.imdb.com/title/tt1578873/?ref_=fn_al_tt_1',  # Pretty Little Liars
    'https://www.imdb.com/title/tt11640018/?ref_=fn_al_tt_1',  # La Brea
    'https://www.imdb.com/title/tt0460649/?ref_=fn_al_tt_1',  # How i met your mother
    'https://www.imdb.com/title/tt10048342/?ref_=nv_sr_srsg_0',  # The Queen's Gambit
    'https://www.imdb.com/title/tt0397442/?ref_=fn_al_tt_1',  # Gossip Girl
    # The Woman in the house across the street from the girl in the window
    'https://www.imdb.com/title/tt13315324/?ref_=nv_sr_srsg_0',
    'https://www.imdb.com/title/tt2100976/?ref_=fn_al_tt_1',  # Impractical Jokers
    'https://www.imdb.com/title/tt4158110/?ref_=fn_al_tt_2',  # Mr. Robot
    'https://www.imdb.com/title/tt3920596/?ref_=fn_al_tt_1',  # Big Little Lies
    'https://www.imdb.com/title/tt10166622/?ref_=fn_al_tt_1',  # The Dropout
    'https://www.imdb.com/title/tt4270492/?ref_=nv_sr_srsg_0',  # Billions
    'https://www.imdb.com/title/tt2085059/?ref_=nv_sr_srsg_0',  # Black Mirror
    'https://www.imdb.com/title/tt1358522/?ref_=fn_al_tt_1',  # White Collar
]


def extract_years(years):
    years_split = years.split('–')
    assert len(years_split) <= 2, '`Years` was not split correctly'
    assert len(years_split) >0, '`Years` was not split correctly'
    pilot_year = years_split[0]
    finale_year = 'ongoing' if len(years_split) == 1 else years_split[1]
    return pilot_year, finale_year

# def extract_html_element(tag, class_name):
#     return soup.find_all(tag, class_=class_name)

blacklist_URL = 'https://www.imdb.com/title/tt2741602/?ref_=fn_al_tt_1'

all_series = []

for index, url in enumerate(URLs):
    try:
        print(f'{index+1}/{len(URLs)}: Scraping {url}...')
        page = requests.get(url)
        soup = BeautifulSoup(page.content, 'html.parser')
        
        # separate class name in IMDb for super long titles:
        if url == 'https://www.imdb.com/title/tt13315324/?ref_=nv_sr_srsg_0':
            title = soup.find_all('h1', class_='sc-b73cd867-0 cAMrQp')[0].text
        else:
            title = soup.find_all('h1', class_='sc-b73cd867-0 eKrKux')[0].text
        years = soup.find_all('span', class_='sc-52284603-2 iTRONr')[0].text
        poster = soup.find('img', class_='ipc-image')['src']
        genres_elements = soup.find_all(
            'a', class_='sc-16ede01-3 bYNgQ ipc-chip ipc-chip--on-baseAlt')
        genres = [genre.text for genre in genres_elements]
        description = soup.find_all('span', class_='sc-16ede01-1 kgphFu')[0].text
        rating = soup.find_all('span', class_='sc-7ab21ed2-1 jGRxWM')[0].text
        top_3_actor_elements = soup.find_all('a', class_='sc-11eed019-1 jFeBIw')[:3]
        top_3_actors = [actor.text for actor in top_3_actor_elements]
        number_of_episodes = soup.find_all('span', class_='ipc-title__subtext')[0].text
        language = soup.find_all('a', class_='ipc-metadata-list-item__list-content-item ipc-metadata-list-item__list-content-item--link')[-7].text
        
        print(f'\t{title} scraped.')
        
        pilot_year, finale_year = extract_years(years)

        series_object = {
            'name': title,
            'genre': genres,
            'description': description,
            'actors': top_3_actors,
            'pilotYear': pilot_year,
            'finaleYear': finale_year,
            'rating': rating,
            'image': poster,
            'episodes': number_of_episodes,
            'language': language
        }

        # print('series_object', series_object)

        all_series.append(series_object)

    except Exception as err:
        print(f'Error "{err}" for the URL {url}')

series_json = json.dumps(all_series)

# export to local file:
with open("series.json", "w") as outfile:
    json.dump(series_json, outfile)
