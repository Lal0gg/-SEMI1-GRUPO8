package store

import (
	"fmt"

	"github.com/dgraph-io/badger/v4"
	"github.com/ostafen/clover/v2"
	doc "github.com/ostafen/clover/v2/document"
	cq "github.com/ostafen/clover/v2/query"
	badgerstore "github.com/ostafen/clover/v2/store/badger"
)

type Store struct {
	*clover.DB
}

type KVStore struct {
	*badger.DB
}

type Doc = map[string]interface{}

func OpenCloverDB(path string) (*Store, error) {
	store, err := badgerstore.OpenWithOptions(badger.DefaultOptions(path))
	if err != nil {
		return nil, err
	}
	cloverDB, err := clover.OpenWithStore(store)
	if err != nil {
		return nil, err
	}
	return &Store{cloverDB}, nil
}

func (s *Store) Init() error {
	exist, err := s.HasCollection("chaps")
	if err != nil {
		return err
	}
	if !exist {
		err = s.CreateCollection("chaps")
		if err != nil {
			return err
		}
	}
	idExists, err := s.HasIndex("chaps", "idSerie")
	if err != nil {
		return err
	}
	if !idExists {
		err = s.CreateIndex("chaps", "idSerie")
	}
	return err
}

func (s *Store) InsertChapter(idSerie int, chapNum int) error {
	doc := doc.NewDocument()
	doc.Set("idSerie", idSerie)
	doc.Set("chapNum", chapNum)
	_, err := s.InsertOne("chaps", doc)
	return err
}

func (s *Store) InsertComment(text string, id_chap int, id_user int) error {
	doc := doc.NewDocument()
	doc.Set("content", text)
	doc.Set("id_usr", id_user)
	doc.Set("id_chapter", id_chap)
	_, err := s.InsertOne("comments", doc)
	return err
}

func (s *Store) InsertNote(value int, idSerie int, id_user int) error {
	doc := doc.NewDocument()
	doc.Set("value", value)
	doc.Set("id_usr", id_user)
	doc.Set("id_serie", idSerie)
	_, err := s.InsertOne("notes", doc)
	return err
}

func (s *Store) AddPageToChapter(idSerie int, chapNum int, pageNum int, url string) error {
	newPage := make(map[string]interface{})
	newPage[fmt.Sprintf("%v", pageNum)] = url
	criteria := cq.Field("idSerie").Eq(idSerie).And(cq.Field("chapNum").Eq(chapNum))
	err := s.Update(
		cq.NewQuery("chaps").Where(criteria),
		newPage,
	)
	return err
}

func (s *Store) GetSeriesChapter(idSerie int, chapNum int) (*Doc, error) {
	criteria := cq.Field("idSerie").Eq(idSerie).And(cq.Field("chapNum").Eq(chapNum))
	doc, err := s.FindFirst(cq.NewQuery("chaps").Where(criteria))
	if err != nil {
		return nil, err
	}
	docMap := doc.AsMap()
	delete(docMap, "idSerie")
	delete(docMap, "chapNum")
	delete(docMap, "_id")
	return &docMap, nil
}

func (s *Store) GetSerieAllChapterNumber(idSerie int) (*[]int, error) {
	criteria := cq.Field("idSerie").Eq(idSerie)
	docs, err := s.FindAll(cq.NewQuery("chaps").Where(criteria))
	if err != nil {
		return nil, err
	}
	docsMaps := make([]int, 0)
	for _, doc := range docs {
		docMap := doc.AsMap()
		chapInt := int(docMap["chapNum"].(int64))
		docsMaps = append(docsMaps, chapInt)
	}
	return &docsMaps, nil
}

func OpenKVStore(path string) (*KVStore, error) {
	opts := badger.DefaultOptions(path)
	opts.Logger = nil
	instance, err := badger.Open(opts)
	if err != nil {
		return nil, err
	}
	return &KVStore{instance}, nil
}

func (k *KVStore) Get(key string) (*string, error) {
	var retVal *string
	retVal = nil
	err := k.View(func(txn *badger.Txn) error {
		item, err := txn.Get([]byte(key))
		if err != nil {
			return err
		}
		valCopy, err := item.ValueCopy(nil)
		if err != nil {
			return nil
		}
		retVal = new(string)
		*retVal = string(valCopy)
		return nil
	})
	return retVal, err
}

func (k *KVStore) Set(key string, value string) error {
	return k.Update(func(txn *badger.Txn) error {
		return txn.Set([]byte(key), []byte(value))
	})
}
