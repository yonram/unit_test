import { BookService } from './book.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Book } from '../models/book.model';
import { environment } from '../../environments/environment.prod';
import swal from 'sweetalert2';


const listBook: Book[] = [
    {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 20,
        amount: 1
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 8,
        amount: 7
    }
];


describe('BookService', () => {

    let service: BookService;
    let httpMock : HttpTestingController;

    beforeEach( () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                BookService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        });
    });

    beforeEach( ()=> {
        service = TestBed.inject(BookService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach( () => {
        localStorage.clear();
        jest.resetAllMocks();
    });

    afterAll( () => {
        httpMock.verify();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('getBooks return a list of book and does a get method', () => {
        service.getBooks().subscribe((resp: Book[]) => {
            expect(resp).toEqual(listBook);
        });

        const req = httpMock.expectOne(environment.API_REST_URL + `/book`);
        expect(req.request.method).toBe('GET');
        req.flush(listBook);
    });

    it('getBooksFromCart return an empty array when localStorage is empty', () => {
        const listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
    });
    
    it('getBooksFromCart return an array of books when it exists in the localStorage', () => {
        localStorage.setItem('listCartBook', JSON.stringify(listBook));
        const newListBook = service.getBooksFromCart(); 
        expect(newListBook.length).toBe(3);
    });
    
    it('addBookToCart add a book successfully when the list does not exits in the localStorage', () => {
        const book: Book = {
            name: '',
            author: '',
            isbn: '',
            price: 15
        };
        const toastMock = {
            fire: () => null
        } as any;
        const spy1 = jest.spyOn(swal, 'mixin').mockImplementation( () => {
            return toastMock;
        });
        let newListBook = service.getBooksFromCart();
        expect(newListBook.length).toBe(0);
        service.addBookToCart(book);
        newListBook = service.getBooksFromCart();
        expect(newListBook.length).toBe(1);
        expect(spy1).toHaveBeenCalledTimes(1);
    });

    // public removeBooksFromCart(): void {
    //     localStorage.setItem('listCartBook', null);
    //   }

    it('removeBooksFromCart removes the list fron the localStorage', () => {
        const toastMock = {
            fire: () => null
        } as any;
        jest.spyOn(swal, 'mixin').mockImplementation( () => {
            return toastMock;
        });
        const book: Book = {
            name: '',
            author: '',
            isbn: '',
            price: 15
        };
        service.addBookToCart(book);
        let newListBook = service.getBooksFromCart();
        expect(newListBook.length).toBe(1);
        service.removeBooksFromCart();
        newListBook = service.getBooksFromCart();
        expect(newListBook.length).toBe(0);
    });


});