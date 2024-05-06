import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Service from '../services/Service';

const Comments = () => {



    const [comments, setComments] = useState([
        {
            name: 'jorge alberto',
            comment: 'Daño a quien le dé de comer a Luffy pide a gritos la paliza de su vida'
        }
    ]);


    const [newComment, setNewComment] = useState('');
    const [userColors, setUserColors] = useState({});
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const capActual = JSON.parse(localStorage.getItem('capituloActual'));
    const capitulo = capActual.capitulo
    const idSerie = capActual.idSerie;
    const token = usuario.token;

    const getRandomColor = () => {
        const colors = ['#FF6B6B', '#48BB78', '#F6E05E', '#4299E1', '#ED64A6', '#9F7AEA'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const GetCommentsssss = async () => {

        console.log("Obteniendo comentarios...")
        console.log("Capitulo: ", capitulo)
        console.log("Serie: ", idSerie)

        Service.GetComments(parseInt(capitulo), parseInt(idSerie)).then((res) => {
            console.log("Comentariossssss: ", res.data.comments)
            const commentsssss = res.data.comments.map(comment => {
                const userName = comment.username;
                const color = userColors[userName] || getRandomColor();
                return {
                    name: userName,
                    comment: comment.content,
                    color: color
                };
            });
            setComments(commentsssss.reverse());
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede obtener las series, datos incorrectos")
            }
        });

    }


    useEffect(() => {
        GetCommentsssss();
    }, []);




    const addComment = () => {
        if (newComment.trim() === '') return;

        const userName = 'Your Name'; // You can replace it with actual user name logic
        const color = userColors[userName] || getRandomColor();

        setComments((prevComments) => [
            {
                name: userName,
                comment: newComment,
                color: color // Assigning color to the comment
            },
            ...prevComments
        ]);

        setUserColors((prevUserColors) => ({
            ...prevUserColors,
            [userName]: color // Storing the color for the user
        }));

        setNewComment('');
    };


    const handlerComments = async () => {
        AgregarComentario();
        //GetCommentsssss();
    }


    const AgregarComentario = async () => {
        console.log("Agregando comentario...")
        console.log("Capitulo: ", capitulo)
        console.log("Serie: ", idSerie)
        console.log("Comentario: ", newComment)

        Service.CreateComment(parseInt(capitulo), token, parseInt(idSerie), newComment).then((res) => {
            console.log("Comentario agregado: ", res.data)
            const userName = usuario.username;
            const color = userColors[userName] || getRandomColor();

            setComments((prevComments) => [
                {
                    name: userName,
                    comment: newComment,
                    color: color // Assigning color to the comment
                },
                ...prevComments
            ]);

            setUserColors((prevUserColors) => ({
                ...prevUserColors,
                [userName]: color // Storing the color for the user
            }));

            setNewComment('');
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede agregar el comentario, datos incorrectos")
            }
        });
    }


    return (
        <div className='flex items-center justify-center'>
            <div className="p-5 w-3/4  bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                <ul className="space-y-2">
                    {comments.map((comment, index) => (
                        <li key={index} className="flex items-center gap-5 bg-gray-100 p-2 rounded-md">
                            <span className="font-semibold flex items-center">
                                <FontAwesomeIcon icon={faUser} className="mr-2" style={{ color: comment.color }} />
                                {comment.name}
                            </span>
                            <div className=''>
                                <div className='bg-white rounded-xl'>
                                    {/* Utilizando un div para cada línea del comentario */}
                                    {comment.comment.split('\n').map((line, i) => (
                                        <div key={i} className="p-2" style={{ textAlign: 'justify' }}>
                                            {line}
                                        </div>
                                    ))}
                                </div>

                            </div>

                        </li>
                    ))}
                </ul>
                <div className="mt-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add your comment..."
                        className="w-full h-20 px-3 py-2 placeholder-gray-500 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    {/* <button
                        onClick={handlerComments}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Add Comment
                    </button> */}

                    <button className="bg-violet-500 text-pink-100 border border-pink-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                                onClick={handlerComments}
                        >
                            <span className="bg-pink-400 shadow-pink-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                            Add
                        </button>
                </div>
            </div>
        </div>
    );
};

export default Comments;