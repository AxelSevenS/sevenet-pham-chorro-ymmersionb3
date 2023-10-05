using System.Text.Json;
using Microsoft.AspNetCore.Mvc;


namespace ApiThf;

public class UserRepository : Repository<User>
{
    public static readonly string fileName = "users.json";


    public UserRepository() : base(fileName) {
        Console.WriteLine(Data.Count);
        for (int i = 0; i < Data.Count; i++)
        {
            Console.WriteLine(Data[i]);
        }
    }


    public async Task<List<User>> GetUsers() {
        return await Task.Run(() => Data);
    }

    
    public async Task<User?> PostUser(User user) {
        return await Task.Run(() => {
            if (Data.Any(u => u.Email == user.Email)) {
                return null;
            }

            user.Id = GetNewId();
            Data.Add(user);
            
            // SaveChanges();
            return user;
        });
    }

    public async Task<User?> PutUserById(uint id, User user) {
        return await Task.Run(() => {
            User? oldUser = Data.FirstOrDefault(u => u.Id == id);
            if (oldUser is not null) {
                oldUser = Data[Data.IndexOf(oldUser)] = oldUser with {
                    Email = user?.Email ?? oldUser.Email,
                    Password = user?.Password ?? oldUser.Password,
                };
            }

            // SaveChanges();
            return oldUser;
        });
    }

    public async Task<User?> DeleteUserById(uint id) {
        return await Task.Run(() => {
            User? user = Data.FirstOrDefault(u => u.Id == id);
            if (user is not null) {
                Data.Remove(user);
            }

            // SaveChanges();
            return user;
        });
    }

    public async Task<User?> GetUserById(uint id) {
        return await Task.Run(() => Data.FirstOrDefault(u => u.Id == id));
    }

    public async Task<User?> GetUserByEmailAndPassword(string email, string password) {
        return await Task.Run(() => Data.FirstOrDefault(u => u.Email == email && u.Password == password));
        
    }


    public bool VerifyUser(User user) {
        return Data.Any(u => u.Email == user.Email && u.Password == user.Password);
    }


    

    public override void SaveChanges() {
        string jsonString = JsonSerializer.Serialize(Data);
        File.WriteAllText(fileName, jsonString);
    }
    

    public uint GetNewId() =>
        Data.Aggregate((uint)0, (max, p) => p.Id > max ? p.Id : max) + 1;

    
    
}
