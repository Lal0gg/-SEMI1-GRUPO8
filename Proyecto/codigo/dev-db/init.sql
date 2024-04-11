CREATE TABLE chapter
(
    id_chapter     SERIAL  NOT NULL,
    chapter_number INTEGER NOT NULL,
    id_serie       INTEGER  NOT NULL,
    PRIMARY KEY (id_chapter)
);

CREATE TABLE comment
(
    id_comment SERIAL NOT NULL,
    content    TEXT   NOT NULL,
    id_usr     SERIAL NOT NULL,
    id_chapter INTEGER NOT NULL,
    PRIMARY KEY (id_comment)
);

CREATE TABLE note
(
    id_note  SERIAL  NOT NULL,
    value    INTEGER NOT NULL,
    id_usr   INTEGER  NOT NULL,
    id_serie INTEGER  NOT NULL,
    PRIMARY KEY (id_note)
);

CREATE TABLE serie
(
    id_serie    SERIAL NOT NULL,
    descr       TEXT   NOT NULL,
    name_serie  TEXT   NOT NULL,
    id_usr      INTEGER NOT NULL,
    PRIMARY KEY (id_serie)
);

CREATE TABLE usr
(
    id_usr   SERIAL NOT NULL,
    username TEXT   NOT NULL,
    PRIMARY KEY (id_usr),
    UNIQUE (username)
);

ALTER TABLE chapter
ADD CONSTRAINT FK_serie_TO_chapter
FOREIGN KEY (id_serie)
REFERENCES serie (id_serie);

ALTER TABLE serie
ADD CONSTRAINT FK_usr_TO_serie
FOREIGN KEY (id_usr)
REFERENCES usr (id_usr);

ALTER TABLE note
ADD CONSTRAINT FK_usr_TO_note
FOREIGN KEY (id_usr)
REFERENCES usr (id_usr);

ALTER TABLE note
ADD CONSTRAINT FK_serie_TO_note
FOREIGN KEY (id_serie)
REFERENCES serie (id_serie);

ALTER TABLE note
ADD CONSTRAINT note_range
CHECK (value >= 1 AND value <= 10);

ALTER TABLE comment
ADD CONSTRAINT FK_usr_TO_comment
FOREIGN KEY (id_usr)
REFERENCES usr (id_usr);

ALTER TABLE comment
ADD CONSTRAINT FK_chapter_TO_comment
FOREIGN KEY (id_chapter)
REFERENCES chapter (id_chapter);

INSERT INTO usr (username) VALUES ('public');
