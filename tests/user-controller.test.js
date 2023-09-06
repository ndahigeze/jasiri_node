const controllers = require('../controllers/user')
const httpMocks = require('node-mocks-http')
const helpers = require('../util/helper-util');
const mongoConnect = require('../util/database').mongoConnect;
let contactsArray=[
    {"_id":"000000","first_name":"Fname","last_name":"lname","userId":"64e65d7c9099f39d679d1a9a","emails":[],"contact_numbers":["+250785254353","+250785254351","+250785254321"]},{"_id":"64e70f56625ed8109d4ec8c3","first_name":"MUrabire","last_name":"gasana","userId":"64e65d7c9099f39d679d1a9a","emails":[],"contact_numbers":[]},
    {"_id":"123132","first_name":"MUkansanga","last_name":"sam","userId":"64e65d7c9099f39d679d1a9a","emails":[],"contact_numbers":[]}
];
const mockGetAllContacts = jest.spyOn(controllers, 'getAllContacts');
const mockContactList = jest.fn(async () => {
    return contactsArray ;
  });
  mockGetAllContacts.mockImplementation(mockContactList);

  jest.clearAllMocks();
//Test controller by mocking it 
it('should get contacts list', async () => {
    
    const response = httpMocks.createResponse();
    const request = httpMocks.createRequest({
        method: 'GET',
        url: '/search_contacts?search_string=',
        headers:{}
    });
   
    expect(response.statusCode).toEqual(200);
    await controllers.getAllContacts(request, response).then(data=>{
        expect(data).toBe(contactsArray);
        expect(data[0]._id).toEqual('000000')
    });
    expect(mockGetAllContacts).toHaveBeenCalledTimes(1);
  });


 
   const mockGetEmails = jest.spyOn(helpers,'getEmails')
   const mockGetPhones = jest.spyOn(helpers,'getPhones')

  describe('testHelpers',()=>{
    // Mock function inside a function 
    test('Get contacts without mocking', async () => {
      let mockEmailList = jest.fn(()=>{
        return contactsArray[0].emails
      })
      let mockPhoneList = jest.fn(()=>{
        return ["+250785254353","+250785254351","+250785254321"]
      })
      mockGetEmails.mockImplementation(mockEmailList)
      mockGetPhones.mockImplementation(mockPhoneList)
      let info=helpers.getInfo(contactsArray[0])
      expect(info.emails.length).toBe(0)
      expect(info.phones.length).toBe(3)
    })

    test('Get Duplicates', async ()=>{
      const response = httpMocks.createResponse();
      const cookies = {
        sid: '64f895b26ba52b78b3e289da',
      };
      
      
      const request = httpMocks.createRequest({
          method: 'GET',
          url: '/get_duplicates',
          state: {
            ['sid']: cookies.sid,
          }, 
      });
      
       mongoConnect(()=>{
        controllers.getDuplicates(request, response).then(data=>{
          expect(data.length).toBe(1)
        });
       })
      
    })

  })

