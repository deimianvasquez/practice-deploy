"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product
from api.utils import generate_sitemap, APIException
import cloudinary.uploader as uploader 


api = Blueprint('api', __name__)

VALID_FORMATS = ["image/png", "image/jpg", "image/jpeg"]

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/products', methods=['POST'])
def upload_image():
    if request.method != 'POST':
        return jsonify({"error": "Method not Allowed"}), 405

    image_file = request.files['file']
    name = request.form.get('name')

    if image_file.content_type not in VALID_FORMATS:
        return jsonify({"error": "File must be png, jpg, or jpeg"}), 400
        
    if image_file is None or name is None:
        return jsonify({"error": "All fields are required(Name, file)"}), 400

    try:
        cloudinary_upload = uploader.upload(image_file)
        new_product = Product(name=name,img_url=cloudinary_upload["url"],  cloudinary_id=cloudinary_upload["public_id"])
        db.session.add(new_product)
        db.session.commit()
        return jsonify({"product": new_product.serialize()})        

    except Exception as error:
        db.session.rollback()
        return jsonify({"error": error}), 500

@api.route('/products', methods=['GET'])
def get_all_products():
    if request.method != 'GET':
        return jsonify({"error": "Method not Allowed"}), 405

    try:
        products = Product.query.all()
        if products is None:
            return jsonify({"error": "No products"})
            
        return jsonify(list(map(lambda item: item.serialize(), products))) , 200

    except Exception as error:
        return jsonify({"error": error}), 500
# @api.route('/')