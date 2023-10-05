using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;


namespace ApiThf;

public class ProductRepository : Repository<Product>
{
    public static readonly string fileName = "data.json";


    public ProductRepository() : base(fileName) {}


    public override void SaveChanges()
    {
        string jsonString = JsonSerializer.Serialize(Data);
        File.WriteAllText(fileName, jsonString);
    }


    public async Task<List<Product>> GetProducts()
    {
        return await Task.Run(() => Data);
    }

    public async Task<HttpResponseMessage> AddImage(uint id, IFormFile image)
    {
        if (image.ContentType != "image/jpeg" && image.ContentType != "image/png") {
            return new HttpResponseMessage(HttpStatusCode.UnsupportedMediaType);
        }

        Product? product = await GetProductById(id);
        if (product is null) {
            return new HttpResponseMessage(HttpStatusCode.NotFound);
        }

        string imageLocation = product.GetImageLocation();
        Directory.CreateDirectory(imageLocation);

        string imagePath = Path.Combine(imageLocation, image.FileName);
        string path = Path.Combine(Directory.GetCurrentDirectory(), imagePath);

        using (FileStream stream = new(path, FileMode.Create)) {
            await image.CopyToAsync(stream);
        }

        (product.Images ??= new()).Add(imagePath);
        SaveChanges();

        return new HttpResponseMessage(HttpStatusCode.OK);
    }

    public async Task<Product?> GetProductById(uint id)
    {
        return await Task.Run(() => Data.FirstOrDefault(x => x.Id == id));
    }

    public async Task<Product?> PostProductAsync(Product product)
    {
        return await Task.Run(() => {
            Data.Add(product);

            return product;
        });
    }

    public async Task<Product?> UpdateProduct(uint id, Product product)
    {
        Product? productToUpdate = await GetProductById(id);
        if (productToUpdate is not null)
        {
            productToUpdate = Data[Data.IndexOf(productToUpdate)] = productToUpdate with
            {
                Name = product.Name,
                Price = product.Price,
                Stock = product.Stock,
                Description = product.Description,
                Images = product.Images,
            };
        }
        
        return productToUpdate;
    }

    public async Task<Product?> DeleteProduct(uint id)
    {
        Product? productToDelete = await GetProductById(id);
        if (productToDelete is not null)
        {
            Data.Remove(productToDelete);
        }

        string? imageLocation = productToDelete?.GetImageLocation();
        if (imageLocation is not null)
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), imageLocation);
            if (Directory.Exists(path))
            {
                Directory.Delete(path, true);
            }
        }

        return productToDelete;
    }

    public uint GetNewId() =>
        Data.Aggregate((uint)0, (max, p) => p.Id > max ? p.Id : max) + 1;
    
}