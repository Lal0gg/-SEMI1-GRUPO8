CREATE TABLE photo
(
    id_photo            SERIAL NOT NULL,
    name                TEXT   NOT NULL,
    description         TEXT   NOT NULL,
    link                TEXT   NOT NULL,
    isProfilePicture    BIT    NOT NULL,
    id_user             SERIAL NOT NULL,
    PRIMARY KEY (id_photo)
);

CREATE TABLE tag
(
    id_tag SERIAL NOT NULL,
    name   TEXT   NOT NULL,
    PRIMARY KEY (id_tag),
    UNIQUE (name)
);

CREATE TABLE tag_photo
(
    id_photo INTEGER NOT NULL,
    id_tag   INTEGER NOT NULL
);

CREATE TABLE usr
(
    id_user  SERIAL NOT NULL,
    username TEXT   NOT NULL,
    name     TEXT   NOT NULL,
    password TEXT   NOT NULL,
    PRIMARY KEY (id_user),
    UNIQUE (username)
);

ALTER TABLE photo
ADD CONSTRAINT FK_user_TO_photo
FOREIGN KEY (id_user)
REFERENCES usr (id_user);

ALTER TABLE tag_photo
ADD CONSTRAINT FK_photo_TO_tag_photo
FOREIGN KEY (id_photo)
REFERENCES photo (id_photo);

ALTER TABLE tag_photo
ADD CONSTRAINT FK_tag_TO_tag_photo
FOREIGN KEY (id_tag)
REFERENCES tag (id_tag);
