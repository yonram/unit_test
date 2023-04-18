import { ReduceTextPipe } from './reduce-text.pipe';

describe('ReduceTextPipe', () => {
  let pipe: ReduceTextPipe;

  beforeEach(() => {
    pipe = new ReduceTextPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('use transform correctly', () => {
    const text = 'hola esto es texto';
    const newtext = pipe.transform(text, 5);

    expect(newtext.length).toBe(5);
  });
});
