import  { useState } from 'react';
export default function Prueba() {
  const [image, setImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newImageName, setNewImageName] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage({
          src: reader.result,
          name: newImageName.trim() || `Foto ${imageList.length + 1}`,
        });
        setNewImageName('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (image) {
      setImageList([...imageList, image]);
      setImage(null);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleChangeName = () => {
    if (selectedImage !== null && newImageName.trim() !== '') {
      const updatedImageList = [...imageList];
      updatedImageList[selectedImage] = { ...updatedImageList[selectedImage], name: newImageName.trim() };
      setImageList(updatedImageList);
      setNewImageName('');
    }
  };

  return (
    <>
      <div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <label>Nombre de la Foto:</label>
        <input type="text" value={newImageName} onChange={(e) => setNewImageName(e.target.value)} />
        <button onClick={handleImageUpload}>Subir Foto</button>
      </div>

      {image && (
        <div style={{ margin: '20px' }}>
          <div
            style={{
              display: 'inline-block',
              borderRadius: '10px',
            }}
          >
            <img
              src={image.src}
              alt="Vista previa"
              style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => handleImageClick(-1)}
            />
            <p>{image.name}</p>
          </div>
        </div>
      )}

      <div>
        <h2>Album de Fotos de Perfil</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {imageList.map((img, index) => (
            <div
              key={index}
              style={{
                margin: '10px',
                width: '150px',
                height: '150px',
                overflow: 'hidden',
                position: 'relative',
                borderRadius: '10px',
              }}
            >
              <img
                src={img.src}
                alt={img.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => handleImageClick(index)}
              />
              <p>{img.name}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedImage !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
          onClick={handleCloseModal}
        >
          <div>
            <img
              src={imageList[selectedImage].src}
              alt={imageList[selectedImage].name}
              style={{ maxWidth: '80%', maxHeight: '80%', borderRadius: '8px' }}
            />
            <label>Nuevo Nombre:</label>
            <input type="text" value={newImageName} onChange={(e) => setNewImageName(e.target.value)} />
            <button onClick={handleChangeName}>Cambiar Nombre</button>
          </div>
        </div>
      )}
    </>
  );
}