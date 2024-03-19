CREATE TABLE album
(
  id_album SERIAL NOT NULL,
  name     TEXT NOT NULL,
  id_user  INTEGER NOT NULL,
  isProfilePictureAlbum BIT NOT NULL,
  PRIMARY KEY (id_album)
);

CREATE TABLE photo
(
  id_photo         SERIAL NOT NULL,
  name             TEXT NOT NULL,
  link             TEXT NOT NULL,
  isProfilePicture BIT     NOT NULL,
  id_album         INTEGER NOT NULL,
  PRIMARY KEY (id_photo)
);

CREATE TABLE userr
(
  id_user  SERIAL NOT NULL,
  username TEXT  NOT NULL UNIQUE,
  name     TEXT  NOT NULL,
  password TEXT NOT NULL,
  PRIMARY KEY (id_user)
);

ALTER TABLE album
  ADD CONSTRAINT FK_user_TO_album
    FOREIGN KEY (id_user)
    REFERENCES userr (id_user);

ALTER TABLE photo
  ADD CONSTRAINT FK_album_TO_photo
    FOREIGN KEY (id_album)
    REFERENCES album (id_album) 
    ON DELETE CASCADE;
