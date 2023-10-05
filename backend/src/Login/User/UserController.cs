using Microsoft.AspNetCore.Mvc;


namespace ApiThf;

[ApiController]
[Route("api/users")]
public class UserController : Controller<UserRepository, User>
{

    public UserController(UserRepository repository) : base(repository) {}


    [HttpGet]
    public async Task<ActionResult<List<User>>> GetAll()
    {
        return await repository.GetUsers();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetById(uint id)
    {
        return await repository.GetUserById(id) switch
        {
            null => NotFound(),
            User user => Ok(user),
        };
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<User>> UpdateUser(uint id, [FromForm] User user)
    {
        User? result = await repository.PutUserById(id, user);
        if (result is null) {
            return NotFound();
        }

        repository.SaveChanges();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<User>> DeleteUser(uint id)
    {
        User? result = await repository.DeleteUserById(id);
        if (result is null) {
            return NotFound();
        }

        repository.SaveChanges();
        return Ok(result);
    }

    
    [HttpPost("login")]
    public async Task<ActionResult<JWT>> AuthenticateUser([FromForm]string email, [FromForm]string password)
    {
        return await repository.GetUserByEmailAndPassword(email, password) switch
        {
            null => NotFound(),
            User user => Ok(JWT.Generate(user)),
        };
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> RegisterUser([FromForm]string email, [FromForm]string password)
    {
        User? result = await repository.PostUser( new User() {
            Email = email, 
            Password = password

        });
        if (result is null) {
            return BadRequest();
        }

        repository.SaveChanges();
        return Ok(result);
    }
    
    
}
