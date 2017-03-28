import { TestNgAppPage } from './app.po';

describe('test-ng-app App', () => {
  let page: TestNgAppPage;

  beforeEach(() => {
    page = new TestNgAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
