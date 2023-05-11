from fastapi import FastAPI, HTTPException
import uvicorn
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi.middleware.cors import CORSMiddleware

# In an actual project I would retrieve this data from environment variables, and use a different credentials
DATABASE = {
    "host": "localhost",
    "database": "zoover",
    "user": "postgres",
    "password": "password",
    "port": "5432"
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_connection():
    conn = psycopg2.connect(**DATABASE)
    return conn


@app.get("/accommodations")
def get_accommodations():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = "SELECT * FROM accommodations"
    cursor.execute(query)
    accommodations = cursor.fetchall()

    cursor.close()
    conn.close()

    data = {}
    for row in accommodations:
        accommodation_id = row["id"]

        data[accommodation_id] = {
            "id": row["id"],
            "uuid": row["uuid"],
            "type": row["type"],
            "name": row["name"],
            "stars": row["stars"],
            "popularityScore": row["popularity_score"],
            "isPublished": row["is_published"],
            "address": {
                "street": row["street_address"],
                "zipCode": row["zip_code"]
            },
            "updatedDate": row["last_updated"]
        }

    return {"data": data}


@app.get("/accommodations/{id}")
def get_accommodation(id):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = "SELECT * FROM accommodations WHERE id = %s"
    cursor.execute(query, (id,))
    accommodation = cursor.fetchone()

    cursor.close()
    conn.close()

    if accommodation:
        return {
            "id": accommodation["id"],
            "uuid": accommodation["uuid"],
            "type": accommodation["type"],
            "name": accommodation["name"],
            "stars": accommodation["stars"],
            "popularityScore": accommodation["popularity_score"],
            "isPublished": accommodation["is_published"],
            "address": {
                "street": accommodation["street_address"],
                "zipCode": accommodation["zip_code"]
            },
            "updatedDate": accommodation["last_updated"]
        }
    else:
        raise HTTPException(
            status_code=404, detail=f'Accommodation with id {id} not found')


@app.get("/accommodations/{accommodation_id}/reviews")
def get_reviews_for_accommodation(accommodation_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = """
    SELECT r.*, a.name AS accommodation_name, ra.name AS aspect_name, rav.value AS aspect_value
    FROM reviews r
    JOIN accommodations a ON r.accommodation_id = a.uuid
    LEFT JOIN review_aspect_values rav ON rav.review_id = r.uuid
    LEFT JOIN review_aspects ra ON ra.id = rav.aspect_id
    WHERE a.id = %s
    """
    cursor.execute(query, (accommodation_id,))
    rows = cursor.fetchall()

    reviews = {}
    for row in rows:
        review_id = row["uuid"]

        if review_id not in reviews:
            reviews[review_id] = {
                "id": row["uuid"],
                "accommodationId": row["accommodation_id"],
                "userId": row["user_id"],
                "userName": row["user_name"],
                "traveledWith": row["traveled_with"],
                "title": row["title"],
                "travelDate": row["travel_date"],
                "entryDate": row["entry_date"],
                "reviewText": row["review_text"],
                "locale": row["locale"],
                "isPublished": row["is_published"],
                "lastUpdated": row["last_updated"],
                "ratings": {
                    "general": {
                        "general": row["general_rating"]
                    },
                    "aspects": {}
                },
            }

        aspect_name = row["aspect_name"]
        aspect_value = row["aspect_value"]
        reviews[review_id]["ratings"]["aspects"][aspect_name] = aspect_value

    cursor.close()
    conn.close()

    if reviews:
        return {"data": list(reviews.values())}
    else:
        raise HTTPException(
            status_code=404, detail=f'Review for accommodation {accommodation_id} not found')


@app.get("/accommodations/{accommodation_id}/reviews/{review_id}")
def get_review(accommodation_id: int, review_id: str):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = """
    SELECT r.*, a.name AS accommodation_name, ra.name AS aspect_name, rav.value AS aspect_value
    FROM reviews r
    JOIN accommodations a ON r.accommodation_id = a.uuid
    LEFT JOIN review_aspect_values rav ON rav.review_id = r.uuid
    LEFT JOIN review_aspects ra ON ra.id = rav.aspect_id
    WHERE a.id = %s AND r.uuid = %s
    """
    cursor.execute(query, (accommodation_id, review_id))
    rows = cursor.fetchall()

    review = None
    for row in rows:
        if review is None:
            review = {
                "id": row["uuid"],
                "accommodationId": row["accommodation_id"],
                "userId": row["user_id"],
                "userName": row["user_name"],
                "traveledWith": row["traveled_with"],
                "title": row["title"],
                "travelDate": row["travel_date"],
                "entryDate": row["entry_date"],
                "reviewText": row["review_text"],
                "locale": row["locale"],
                "isPublished": row["is_published"],
                "lastUpdated": row["last_updated"],
                "ratings": {
                    "general": {
                        "general": row["general_rating"]
                    },
                    "aspects": {}
                },
            }

        aspect_name = row["aspect_name"]
        aspect_value = row["aspect_value"]
        review["ratings"]["aspects"][aspect_name] = aspect_value

    cursor.close()
    conn.close()

    if review:
        return review
    else:
        raise HTTPException(
            status_code=404, detail=f'Review {review_id} for accommodation {accommodation_id} not found')


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8888)
