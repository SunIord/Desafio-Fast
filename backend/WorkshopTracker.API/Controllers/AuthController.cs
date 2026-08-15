using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkshopTracker.API.Data;
using WorkshopTracker.API.DTOs;
using WorkshopTracker.API.Services;

namespace WorkshopTracker.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtTokenGenerator _tokenGenerator;

    public AuthController(AppDbContext context, JwtTokenGenerator tokenGenerator)
    {
        _context = context;
        _tokenGenerator = tokenGenerator;
    }

    // POST /api/auth/login
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Username == dto.Username);

        if (usuario is null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
            return Unauthorized(new { mensagem = "Usuário ou senha inválidos." });

        var (token, expiresAt) = _tokenGenerator.GenerateToken(usuario);

        return Ok(new LoginResponseDto
        {
            Token = token,
            Username = usuario.Username,
            ExpiresAt = expiresAt
        });
    }
}