using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;

namespace ApiThf;

[ApiController]
[Route("api/products")]
public class ProductController : Controller<ProductRepository, Product>
{

    public ProductController(ProductRepository repository) : base(repository) {}


    /// <summary>
    /// Get a new id for a new product
    /// </summary>
    /// <returns>
    /// A new id for a new product
    /// </returns>
    [HttpGet("newId")]
    public ActionResult<uint> GetNewId()
    {
        return repository.GetNewId();
    }

    /// <summary>
    /// Get all products
    /// </summary>
    /// <returns>
    /// All products
    /// </returns>
    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetAll()
    {
        return await repository.GetProducts();
    }

    /// <summary>
    /// Get a product by id
    /// </summary>
    /// <param name="id">The id of the product</param>
    /// <returns>
    /// The product with the given id
    /// </returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetById(uint id)
    {
        return await repository.GetProductById(id) switch
        {
            null => NotFound(),
            Product res => Ok(res),
        };
    }

    /// <summary>
    /// Get a product by name
    /// </summary>
    /// <param name="Product">The Product to add to the database</param>
    /// <returns>
    /// The added Product
    /// </returns>
    [HttpPost]
    public async Task<ActionResult<Product>> Post([FromForm] Product Product)
    {
        if ( !IsAuthValid(Request, out JWT? token) /* || token?.payload.role != "admin" */) {
            return Unauthorized();
        }

        Product.Id = repository.GetNewId();

        await repository.PostProductAsync(Product);
        await PostImages(Request, Product.Id);
        
        repository.SaveChanges();
        return Ok(Product);
    }

    /// <summary>
    /// Add images to a product
    /// </summary>
    /// <param name="id">The id of the product</param>
    /// <returns></returns>
    [HttpPost("{id}/images")]
    public async Task<ActionResult> PostImages(uint id)
    {
        return await PostImages(Request, id);
    }

    /// <summary>
    /// Update a product
    /// </summary>
    /// <param name="id">The id of the product</param>
    /// <param name="product">The product to update</param>
    /// <returns>
    /// The updated product
    /// </returns>
    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> Put(uint id, [FromForm] Product product)
    {
        if (id == 0)
        {
            return BadRequest();
        }
        
        Product? oldProduct = await repository.GetProductById(id);
        if (oldProduct is null)
        {
            return NotFound();
        }

        Product? result = await repository.UpdateProduct(id, product with {
            Name = product.Name ?? oldProduct?.Name,
            Description = product.Description ?? oldProduct?.Description,
            Stock = product.Stock ?? oldProduct?.Stock,
            Price = product.Price ?? oldProduct?.Price,
            Images = product.Images ?? oldProduct?.Images,
        });
        if (result is null)
        {
            return NotFound();
        }

        await PostImages(id);

        repository.SaveChanges();
        return Ok(result);
    }

    /// <summary>
    /// Delete a product
    /// </summary>
    /// <param name="id">The id of the product</param>
    /// <returns></returns>
    /// <response code="200">The product was deleted</response>
    /// <response code="404">The product was not found</response>
    /// <response code="400">The id was 0</response>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(uint id)
    {
        if (id == 0)
        {
            return BadRequest();
        }

        Product? product = await repository.GetProductById(id);
        if (product == null)
        {
            return NotFound();
        }

        await repository.DeleteProduct(id);

        repository.SaveChanges();
        return Ok();
    }

    /// <summary>
    /// Post images to the server and attach them to a product
    /// </summary>
    /// <param name="request">The request containing the images</param>
    /// <param name="id">The id of the product</param>
    /// <returns></returns>
    /// <response code="200">The images were added</response>
    /// <response code="400">The id was 0 or the request was invalid</response>
    /// <response code="404">The product was not found</response>
    private async Task<ActionResult> PostImages(HttpRequest request, uint id)
    {
        // check if form is valid
        if (id == 0 || !Request.HasFormContentType)
        {
            return BadRequest();
        }
        IFormCollection httpRequest = Request.Form;


        ModelStateDictionary modelState = new();
        foreach (IFormFile file in httpRequest.Files)
        {
            HttpResponseMessage response = await repository.AddImage(id, file);
            if (response.StatusCode != HttpStatusCode.OK)
            {
                modelState.AddModelError(file.Name, response.ReasonPhrase ?? "Unknown error");
            }
        }

        if (modelState.Count > 0)
        {
            return BadRequest(modelState);
        }

        return Ok();
    }

}
