using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Net;

namespace ApiThf;

[ApiController]
[Route("api/products")]
public class ProductController : Controller<ProductRepository, Product>
{

    public ProductController(ProductRepository repository) : base(repository) {}



    [HttpGet("newId")]
    public ActionResult<uint> GetNewId()
    {
        return repository.GetNewId();
    }

    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetAll()
    {
        return await repository.GetProducts();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetById(uint id)
    {
        return await repository.GetProductById(id) switch
        {
            null => NotFound(),
            Product res => Ok(res),
        };
    }

    [HttpPost]
    public async Task<ActionResult<Product>> Post([FromForm] Product Product)
    {
        Product.Id = repository.GetNewId();
        
        await repository.PostProductAsync(Product);

        await PostImages(Product.Id);
        
        repository.SaveChanges();
        return Ok(Product);
    }

    [HttpPost("{id}/images")]
    public async Task<ActionResult> PostImages(uint id)
    {
        if (id == 0) {
            return BadRequest();
        }

        IFormCollection httpRequest = HttpContext.Request.Form;

        bool failed = false;
        foreach (IFormFile file in httpRequest.Files)
        {
            HttpResponseMessage response = await repository.AddImage(id, file);
            if (response.StatusCode != HttpStatusCode.OK) {
                failed = true;
            }
        }

        if (failed) {
            return BadRequest();
        }

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> Put(uint id, [FromForm] Product product)
    {
        if (id == 0) {
            return BadRequest();
        }
        
        Product? oldProduct = await repository.GetProductById(id);
        if (oldProduct is null) {
            return NotFound();
        }

        Product? result = await repository.UpdateProduct(id, product with {
            Name = product.Name ?? oldProduct?.Name,
            Description = product.Description ?? oldProduct?.Description,
            Stock = product.Stock ?? oldProduct?.Stock,
            Price = product.Price ?? oldProduct?.Price,
            Images = product.Images ?? oldProduct?.Images,
        });
        if (result is null) {
            return NotFound();
        }

        await PostImages(id);

        repository.SaveChanges();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(uint id)
    {
        if (id == 0) {
            return BadRequest();
        }

        Product? product = await repository.GetProductById(id);
        if (product == null) {
            return NotFound();
        }

        await repository.DeleteProduct(id);

        repository.SaveChanges();
        return Ok();
    }

}
