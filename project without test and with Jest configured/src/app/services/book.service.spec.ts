import { environment } from './../../environments/environment';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BookService } from './book.service';
import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Book } from '../models/book.model';
import swal from 'sweetalert2';

const listBook: Book[] = [
  { name: '', author: '', isbn: '', price: 15, amount: 2 },
  { name: '', author: '', isbn: '', price: 20, amount: 1 },
  { name: '', author: '', isbn: '', price: 8, amount: 7 },
];

describe('Description', () => {
  let service: BookService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  afterAll(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('get books return list ok books', () => {
    service.getBooks().subscribe((resp: Book[]) => {
      expect(resp).toEqual(listBook);
    });

    const req = httpMock.expectOne(environment.API_REST_URL + '/book');
    expect(req.request.method).toBe('GET');
    req.flush(listBook);
  });

  it('getBooksFromCart return a empty array when localStorage is empty ', () => {
    const listBook = service.getBooksFromCart();
    expect(listBook.length).toBe(0);
  });

  it('getBooksFromCart return an array of books when exists localStorage', () => {
    localStorage.setItem('listCartBook', JSON.stringify(listBook));
    const newListBook = service.getBooksFromCart();
    expect(newListBook.length).toBe(3);
  });

  it('addBookToCard add a book successfully when list doest no exits in localStorage ', () => {
    const book: Book = { name: '', author: '', isbn: '', price: 15 };
    const toastMock = {
      fire: () => null,
    } as any;

    const spy1 = jest.spyOn(swal, 'mixin').mockImplementation(() => {
      return toastMock;
    });

    let newListBook: Book[] = service.getBooksFromCart();
    expect(newListBook.length).toBe(0);
    service.addBookToCart(book);
    newListBook = service.getBooksFromCart();
    expect(newListBook.length).toBe(1);
    expect(spy1).toHaveBeenCalledTimes(1);
  });

  it('addBookToCard add a book successfully when list exits in localStorage ', () => {
    localStorage.setItem('listCartBook', JSON.stringify(listBook));
    const book: Book = {
      id: '4',
      name: '',
      author: '',
      isbn: '90',
      price: 100,
    };
    const toastMock = {
      fire: () => null,
    } as any;
    const spy1 = jest.spyOn(swal, 'mixin').mockImplementation(() => {
      return toastMock;
    });

    let newListBook = service.getBooksFromCart();
    expect(newListBook.length).toBe(3);
    service.addBookToCart(book);
    newListBook = service.getBooksFromCart();
    expect(newListBook.length).toBe(4);
  });

  it('addBookToCard add a book successfully when list exits in localStorage and item exist', () => {
    localStorage.setItem('listCartBook', JSON.stringify(listBook));
    const book: Book = {
      name: '',
      author: '',
      isbn: '90',
      price: 100,
      amount: 100,
    };
    const toastMock = {
      fire: () => null,
    } as any;
    const spy1 = jest.spyOn(swal, 'mixin').mockImplementation(() => {
      return toastMock;
    });

    let newListBook = service.getBooksFromCart();
    expect(newListBook.length).toBe(3);
    service.addBookToCart(book);
    newListBook = service.getBooksFromCart();
    expect(newListBook.length).toBe(3);
  });

  it('removeBooksFromCart removes the list from localStorage', () => {
    const toastMock = {
      fire: () => null,
    } as any;
    const spy1 = jest.spyOn(swal, 'mixin').mockImplementation(() => {
      return toastMock;
    });

    const book: Book = { name: '', author: '', isbn: '', price: 15 };
    service.addBookToCart(book);

    let newListBook = service.getBooksFromCart();

    expect(newListBook.length).toBe(1);
    service.removeBooksFromCart();

    newListBook = service.getBooksFromCart();
    expect(newListBook.length).toBe(0);
  });
});
