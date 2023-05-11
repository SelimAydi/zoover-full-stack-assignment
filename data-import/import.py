import json
import psycopg2

# Connect to the database
# In an actual project I would retrieve this data from environment variables, and use a different credentials
connection = psycopg2.connect(
    host="localhost",
    database="zoover",
    user="postgres",
    password="password"
)

cursor = connection.cursor()


def init_db(cursor):
    # Instantiate tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS accommodations (
            id SERIAL PRIMARY KEY,
            uuid TEXT UNIQUE NOT NULL,
            type TEXT,
            name TEXT,
            stars INTEGER,
            popularity_score DOUBLE PRECISION,
            is_published BOOLEAN,
            street_address TEXT,
            zip_code TEXT,
            last_updated TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            uuid TEXT UNIQUE NOT NULL,
            accommodation_id TEXT REFERENCES accommodations(uuid) ON DELETE SET NULL,
            user_id TEXT NOT NULL,
            user_name TEXT,
            traveled_with TEXT,
            general_rating INTEGER,
            title TEXT,
            travel_date TIMESTAMP,
            entry_date TIMESTAMP,
            review_text TEXT,
            locale TEXT,
            is_published BOOLEAN,
            last_updated TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS review_aspects (
            id SERIAL PRIMARY KEY,
            name TEXT
        );

        CREATE TABLE IF NOT EXISTS review_aspect_values (
            id SERIAL PRIMARY KEY,
            review_id TEXT NOT NULL REFERENCES reviews(uuid),
            aspect_id INTEGER NOT NULL REFERENCES review_aspects(id),
            value INTEGER
        );
    """)

    connection.commit()


def insert_review_aspects(cursor):
    aspects = ['location', 'service', 'priceQuality', 'food', 'room', 'childFriendly', 'interior', 'size', 'activities', 'restaurants', 'sanitaryState', 'accessibility', 'nightlife',
               'culture', 'surrounding', 'atmosphere', 'noviceSkiArea', 'advancedSkiArea', 'apresSki', 'beach', 'entertainment', 'environmental', 'pool', 'terrace', 'housing', 'hygiene']

    query = """
    INSERT INTO review_aspects (name)
    VALUES (%s)
    """

    values = [(aspect,) for aspect in aspects]
    cursor.executemany(query, values)
    connection.commit()


def insert_review_aspect_values(cursor, review):
    query_check = "SELECT 1 FROM reviews WHERE uuid = %s"

    query = """
    INSERT INTO review_aspect_values (review_id, aspect_id, value)
    VALUES (%s, (SELECT id FROM review_aspects WHERE name = %s), %s)
    """

    review_id = review["id"]
    aspect_values = review["ratings"]["aspects"]

    values_check = (review_id,)
    cursor.execute(query_check, values_check)

    if cursor.fetchone():
        values = []

        for aspect, value in aspect_values.items():
            values.append((review_id, aspect, value))

        cursor.executemany(query, values)
        connection.commit()


def import_entity(file_path, insert_fn):
    # Load file
    with open(file_path, "r") as file:
        entities = json.load(file)

    try:
        # Insert entities into db
        for entity in entities:
            insert_fn(cursor, entity)

            if insert_fn is insert_review:
                # Insert aspect values for reviews
                insert_review_aspect_values(cursor, entity)

        connection.commit()
    except Exception as e:
        # Rollback if an error occurs
        connection.rollback()
        raise e


def insert_accommodation(cursor, accommodation):
    query = """
    INSERT INTO accommodations (uuid, type, name, stars, popularity_score, is_published, street_address, zip_code, last_updated)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, to_timestamp(%s / 1000.0))
    """

    uuid = accommodation["id"]
    name = get_localized_text(accommodation["names"]["main"]) or ""
    type = accommodation["type"]
    stars = accommodation["stars"]
    popularity_score = accommodation["popularityScore"]
    is_published = accommodation["status"]["published"]
    street_address = accommodation["address"]["street"]
    zip_code = accommodation["address"]["zipcode"]
    last_updated = accommodation["updatedDate"]

    values = (uuid, type, name, stars, popularity_score,
              is_published, street_address, zip_code, last_updated)

    cursor.execute(query, values)


def get_localized_text(obj, default_locale='nl'):
    # Normally I would implement this differently to take localization into account
    # For now I use the standard dutch locale if it exists, otherwise the first other locale available
    if not obj:
        return None

    return obj[default_locale] if default_locale in obj else list(
        obj.values())[0]


def insert_review(cursor, review):
    query_check = "SELECT 1 FROM accommodations WHERE uuid = %s"

    query = """
    INSERT INTO reviews (uuid, accommodation_id, user_id, user_name, traveled_with, general_rating, title, travel_date, entry_date, review_text, locale, is_published, last_updated)
    VALUES (%s, %s, %s, %s, %s, %s, %s, to_timestamp(%s / 1000.0), to_timestamp(%s / 1000.0), %s, %s, %s, to_timestamp(%s / 1000.0))
    """

    uuid = review["id"]
    accommodation_id = review["parents"][0]["id"]
    user_id = review["user"]["id"]
    user_name = review["originalUserName"]
    traveled_with = review["traveledWith"]
    general_rating = review["ratings"]["general"]["general"]
    title = get_localized_text(review["titles"]) or ""
    travel_date = review["travelDate"]
    entry_date = review["entryDate"]
    review_text = get_localized_text(review["texts"]) or ""
    locale = review["locale"]
    is_published = review["status"]["published"]
    last_updated = review["updatedDate"]

    values_check = (accommodation_id,)
    cursor.execute(query_check, values_check)

    if cursor.fetchone():
        values_insert = (
            uuid,
            accommodation_id,
            user_id,
            user_name,
            traveled_with,
            general_rating,
            title,
            travel_date,
            entry_date,
            review_text,
            locale,
            is_published,
            last_updated
        )

        cursor.execute(query, values_insert)


init_db(cursor)
insert_review_aspects(cursor)
import_entity('accommodations.json', insert_accommodation)
import_entity('reviews.json', insert_review)

cursor.close()
connection.close()
