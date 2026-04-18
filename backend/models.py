from pydantic import BaseModel, EmailStr

class ContactForm(BaseModel):
    name:    str
    email:   EmailStr
    message: str

class RegisteredUser(BaseModel):
    name:  str
    email: EmailStr
    phone: str

