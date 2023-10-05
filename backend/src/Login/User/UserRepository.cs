using System.Text.Json;
using Microsoft.AspNetCore.Mvc;


namespace ApiThf;

public class UserRepository : Repository<User>
{
    public static readonly string fileName = "users.json";


    public UserRepository() : base(fileName) {}


    public async Task<List<User>> GetUsers() {
        return await Task.Run(() => Data);
    }

    
    public async Task<User?> PostUser(User user) {
        return await Task.Run(() => {
            if (Data.Any(u => u.email == user.email)) {
                return null;
            }

            user.id = GetNewId();
            Data.Add(user);
            
            // SaveChanges();
            return user;
        });
    }

    public async Task<User?> PutUserById(uint id, User user) {
        return await Task.Run(() => {
            User? oldUser = Data.FirstOrDefault(u => u.id == id);
            if (oldUser is not null) {
                oldUser = Data[Data.IndexOf(oldUser)] = oldUser with {
                    email = user?.email ?? oldUser.email,
                    password = user?.password ?? oldUser.password,
                };
            }

            // SaveChanges();
            return oldUser;
        });
    }

    public async Task<User?> DeleteUserById(uint id) {
        return await Task.Run(() => {
            User? user = Data.FirstOrDefault(u => u.id == id);
            if (user is not null) {
                Data.Remove(user);
            }

            // SaveChanges();
            return user;
        });
    }

    public async Task<User?> GetUserById(uint id) {
        return await Task.Run(() => Data.FirstOrDefault(u => u.id == id));
    }

    public async Task<User?> GetUserByEmailAndPassword(string email, string password) {
        return await Task.Run(() => Data.FirstOrDefault(u => u.email == email && u.password == password));
        
    }


    public bool VerifyUser(User user) {
        return Data.Any(u => u.email == user.email && u.password == user.password);
    }


    

    public override void SaveChanges() {
        string jsonString = JsonSerializer.Serialize(Data);
        File.WriteAllText(fileName, jsonString);
    }
    

    public uint GetNewId() =>
        Data.Aggregate((uint)0, (max, p) => p.id > max ? p.id : max) + 1;

    
    
}
