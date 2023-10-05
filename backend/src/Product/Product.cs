namespace ApiThf;

public record Product
{
    public uint Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public float? Price { get; set; }
    public float? Stock { get; set; }
    public List<string>? Images { get; set; }


    public string GetImageLocation() {
        return Path.Combine("Resources/Images", Id.ToString());
    }
}
