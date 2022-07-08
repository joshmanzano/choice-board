import React from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { Container, Grid } from '@mantine/core';
import './App.css';
import axios from 'axios';
import MovieCard from './MovieCard';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHcnygt0kI4igHCCxOgNSF_mvkrBbVbrk",
  authDomain: "moviepicker-2a4e3.firebaseapp.com",
  projectId: "moviepicker-2a4e3",
  storageBucket: "moviepicker-2a4e3.appspot.com",
  messagingSenderId: "937617524701",
  appId: "1:937617524701:web:9b0b1a1c28653e4ee55834"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const img_url = 'https://www.themoviedb.org/t/p/w440_and_h660_face/';

function App() {

  // React.useEffect(() => {
  //   axios.get('https://api.themoviedb.org/3/movie/popular?api_key=b8ec09033f0e2d47aafc15b9aa09e519&language=en-US&page=1').then((response) => {
  //     console.log(response)
  //   });
  // }, []);

  const [movies, setMovies] = React.useState([[]]);

  async function addMovie(){
    try{
      const docRef = await addDoc(collection(db, 'movies'), {
        name: 'test2',
        genre: 'test2',
        trailer: 'test3',
        summary: 'test4',
      });
      console.log(docRef.id);
    } catch (e){
      console.error('Error add');
    }
  }

  React.useEffect(() => {
    async function execute(){
      const array_movies:any[] = [];
      const movies = await getDocs(collection(db, 'movies'));
      movies.forEach((movie) => {
        array_movies.push(
          [movie.data().name,
          movie.data().genre,
          movie.data().trailer,
          movie.data().summary,
          movie.data().img]
        )
      });
      setMovies(array_movies);
    }
    execute();
  }, []);

  React.useEffect(() => {
    console.log(movies);
  }, [movies]);

  return (
    <Container my="md">
      <Grid>
        {movies.map((movie) => {
            return (
              <Grid.Col xs={4}>
                <MovieCard name={movie[0]} genre={movie[1]} trailer={movie[2]} summary={movie[3]} img={movie[4]}/>
              </Grid.Col>
            )
          })
        }
      </Grid>
      <Grid>

      </Grid>
    </Container>
  );
}

export default App;
