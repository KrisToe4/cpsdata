import { CpsDataPage } from './app.po';

describe('cps-data App', () => {
  let page: CpsDataPage;

  beforeEach(() => {
    page = new CpsDataPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
