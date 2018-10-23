import React from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from '../../BooksAPI';
import Shelf from '../Shelf';
import Book from '../Book';

class MainPage extends React.Component {
	constructor(props) {
	super(props);
	this.state = {
		books: []
	}
}

	componentDidMount() {
		BooksAPI.getAll()
		.then(result => {
			this.setState({ books: result} );
		});
	}

	reassignBookShelf = (book, shelf) => {
		BooksAPI.update(book, shelf).then(result => {
			book.shelf = shelf;
			this.setState(state => ({
				books: state.books.filter(bk => bk.id !== book.id).concat([book])
	 		
		}));
	});
  }
  
	render() {
		return (
			<div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
              	<Shelf reassignBookShelf={this.reassignBookShelf} name= "Currently Reading" books={this.state.books.filter(b => b.shelf === "currentlyReading")} />
              	<Shelf reassignBookShelf={this.reassignBookShelf} name= "Want to Read" books={this.state.books.filter(b => b.shelf === "wantToRead")} />
              	<Shelf reassignBookShelf={this.reassignBookShelf} name= "Read" books={this.state.books.filter(b => b.shelf === "read")} />
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link> 
            </div>
          </div>
		);
	}
}

export default MainPage;