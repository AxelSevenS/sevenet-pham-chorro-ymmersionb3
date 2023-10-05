using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace ApiThf;

public record JWT {

    public static readonly string Secret = "Nawmn47obf1NiJD/+/BNDKD55iOY8ct695aa8J1smZgADdLurcGnSoWhbEjejG0tWvgtGCyJpyebTwI6EA1u8A==";


    public string Header { get; set; }
    public string Payload { get; set; }
    public string Signature { get; set; }


    public JWT(string header, string payload, string signature) {
        Header = header;
        Payload = payload;
        Signature = signature;
    }


    private static string Base64UrlEncode(string input) {
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(input))
            .Replace('+', '-')
            .Replace('/', '_')
            .Replace("=", "");
    }

    private static string Base64UrlDecode(string input) {
        input = input.Replace('-', '+').Replace('_', '/');
        switch (input.Length % 4) {
            case 0:
                break;
            case 2:
                input += "==";
                break;
            case 3:
                input += "=";
                break;
            default:
                throw new Exception("Illegal base64url string!");
        }

        return Encoding.UTF8.GetString(Convert.FromBase64String(input));
    }


    public JWTHeader GetDecodedHeader() => JsonSerializer.Deserialize<JWTHeader>(Base64UrlDecode(Header)) ?? throw new Exception("Invalid JWT header");
    public JWTPayload GetDecodedPayload() => JsonSerializer.Deserialize<JWTPayload>(Base64UrlDecode(Payload)) ?? throw new Exception("Invalid JWT payload");
    public string GetDecodedSignature() => Base64UrlDecode(Signature);

    public static JWT? Parse(string jwt) {
        string[] parts = jwt.Split('.');
        if (parts.Length != 3) {
            return null;
        }

        return new JWT(parts[0], parts[1], parts[2]);
    }

    public bool Verify() {
        if (GetDecodedPayload().Exp < DateTimeOffset.UtcNow.ToUnixTimeSeconds()) {
            return false;
        }

        return GenerateSignature() == Signature;
    }

    public static JWT Generate(User user) {
        uint iat = (uint)DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        uint exp = (uint)DateTimeOffset.UtcNow.AddDays(7).ToUnixTimeSeconds();
        string header = Base64UrlEncode(JsonSerializer.Serialize(new JWTHeader()));
        string payload = Base64UrlEncode(JsonSerializer.Serialize(new JWTPayload() {
            Id = user.Id,
            Email = user.Email,
            Iat = iat,
            Exp = exp,
        }));
        string signature = Base64UrlEncode( GenerateSignature(header, payload) );

        return new JWT(header, payload, signature);
    }

    private static string GenerateSignature(string header, string payload) {
        byte[] secretBytes = Encoding.UTF8.GetBytes(Secret);
        using var hmac = new HMACSHA256(secretBytes);
        byte[] signatureBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(header + "." + payload));
        return Base64UrlDecode(Convert.ToBase64String(signatureBytes));
    }

    public string GenerateSignature() {
        return GenerateSignature(Header, Payload);
    }

    public override string ToString()
    {
        return Header + "." + Payload + "." + Signature;
    }



    public record class JWTHeader {
        public string Alg { get; set; } = "HS256";
        public string Typ { get; set; } = "JWT";
    }

    public record class JWTPayload {
        public uint Id { get; set; } = 1;
        public string? Email { get; set; } = "";
        public uint Iat { get; set; } = 0;
        public uint Exp { get; set; } = 0;
    }

    
}