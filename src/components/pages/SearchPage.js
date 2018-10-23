import React from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from '../../BooksAPI';
import Book from '../Book';

class SearchPage extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    books: [],
    results: [],
    query: ""
    }
  }

  componentDidMount() {
    BooksAPI.getAll()
    .then(result => {
      this.setState({ books: result} );
    });
  }

  updateQuery = (query) => {
    this.setState({query: query}, this.searchBooks);
  }

  searchBooks() {
    if (this.state.query === '' || this.state.query === undefined) {
      return this.setState({ results: []});
    }
    BooksAPI.search(this.state.query.trim()).then(r => {
      if(r.error) {
        return this.setState({ results: []});
      }
      else {
        r.forEach(bk => {
          let l = this.state.books.filter(BK => BK.id === bk.id);
          if(l[0]) { bk.shelf = l[0].shelf; }
        });
        return this.setState({ results: r});
      }
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
			<div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to="/">Close</Link>
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author" value = {this.state.query}
                  onChange = {(event) => this.updateQuery(event.target.value)} />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"> 
                {
                  this.state.results.map((book, key) => <Book reassignBookShelf={this.reassignBookShelf} book={book} key={key} /> )
                }
               </ol>
            </div>
          </div>
		);
	}
}

export default SearchPage;