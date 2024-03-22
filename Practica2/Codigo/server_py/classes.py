from typing import Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    name: str
    photo_base64:str

class Message(BaseModel):
    message: str

class User(BaseModel):
    id: int
    username:str
    name:str
    profile_picture_url:str
    tags: list[str]

class PhotoUpload(BaseModel):
    user_id: int
    photo_name: str
    photo_description: str
    photo_base64: str

class DescTranslation(BaseModel):
    lang: str
    text: str

class Photo(BaseModel):
    photo_id: int
    photo_name: str
    photo_desc: str
    photo_url: str
    photo_translations: Optional[list[DescTranslation]]= None

class PhotoText(BaseModel):
    photo_base64: str

class Album(BaseModel):
    album_id: int
    album_name: str

class AlbumPhotos(BaseModel):
    album_id:int
    photos:list[Photo]

class AlbumList(BaseModel):
    albums:list[Album]

class Login(BaseModel):
    username:str
    password:str

class LoginPhoto(BaseModel):
    username:str
    photo_base64:str
    
class LoginResponse(BaseModel):
    correct:bool

class UserUpdate(BaseModel):
    password:str
    user_id:int
    new_username:Optional[str]= None
    new_name:Optional[str]= None
    new_photo_base64:Optional[str]= None
