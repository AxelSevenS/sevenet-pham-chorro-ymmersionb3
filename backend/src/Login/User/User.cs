namespace ApiThf;

public record User
{
    public uint Id { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    
}