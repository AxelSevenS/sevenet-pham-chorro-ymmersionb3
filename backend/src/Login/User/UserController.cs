using System.Text.Json;
using Microsoft.AspNetCore.Mvc;


namespace ApiThf;

[ApiController]
[Route("api/users")]
public class UserController : Controller<UserRepository, User>
{

    public UserController(UserRepository repository) : base(repository) {}

    /// <summary>
    /// Get all users
    /// </summary>
    /// <returns>
    /// All users
    /// </returns>
    [HttpGet]
    public async Task<ActionResult<List<User>>> GetAll()
    {
        return await repository.GetUsers();
    }

    /// <summary>
    /// Get a user by id
    /// </summary>
    /// <param name="id">The id of the user</param>
    /// <returns>
    /// The user with the given id
    /// </returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetById(uint id)
    {
        return await repository.GetUserById(id) switch
        {
            null => NotFound(),
            User user => Ok(user),
        };
    }

    /// <summary>
    /// Authenticate a user
    /// </summary>
    /// <param name="email">The email of the user</param>
    /// <param name="password">The password of the user</param>
    /// <returns>
    /// The JWT token of the user,
    ///     or NotFound if the user does not exist,
    ///     or BadRequest if the email/password is incorrect
    /// </returns>
    [HttpPost("login")]
    public async Task<ActionResult> AuthenticateUser([FromForm]string email, [FromForm]string password)
    {
        return await repository.GetUserByEmailAndPassword(email, JWT.HashPassword(password)) switch
        {
            null => NotFound(),
            User user => Ok(JsonSerializer.Serialize(JWT.Generate(user).ToString())),
        };
    }

    /// <summary>
    /// Register a user
    /// </summary>
    /// <param name="email">The email of the user</param>
    /// <param name="password">The password of the user</param>
    /// <returns>
    /// The user,
    ///    or BadRequest if the user already exists
    /// </returns>
    [HttpPost("register")]
    public async Task<ActionResult<User>> RegisterUser([FromForm]string email, [FromForm]string password)
    {
        User? result = await repository.PostUser( new()
        {
            email = email,
            password = JWT.HashPassword(password)
        });

        if (result is null)
        {
            return BadRequest();
        }

        repository.SaveChanges();
        return Ok(result);
    }

    /// <summary>
    /// Update a user
    /// </summary>
    /// <param name="id">The id of the user</param>
    /// <param name="user">The user to update</param>
    /// <returns>
    /// The updated user
    /// </returns>
    [HttpPut("{id}")]
    public async Task<ActionResult<User>> UpdateUser(uint id, [FromForm] User user)
    {
        if (user is null)
        {
            return BadRequest();
        }

        User? result = await repository.PutUserById(id, user with
        {
            password = JWT.HashPassword(user.password ?? "")
        });
        if (result is null)
        {
            return NotFound();
        }

        repository.SaveChanges();
        return Ok(result);
    }

    /// <summary>
    /// Delete a user
    /// </summary>
    /// <param name="id">The id of the user</param>
    /// <returns>
    /// The deleted user
    /// </returns>
    [HttpDelete("{id}")]
    public async Task<ActionResult<User>> DeleteUser(uint id)
    {
        User? result = await repository.DeleteUserById(id);
        if (result is null)
        {
            return NotFound();
        }

        repository.SaveChanges();
        return Ok(result);
    }
    
    
}
