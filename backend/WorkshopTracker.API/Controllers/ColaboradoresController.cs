using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkshopTracker.API.Data;
using WorkshopTracker.API.DTOs;
using WorkshopTracker.API.Models;

namespace WorkshopTracker.API.Controllers;

[ApiController]
[Route("api/colaboradores")]
public class ColaboradoresController : ControllerBase
{
    private readonly AppDbContext _context;

    public ColaboradoresController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/colaboradores
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ColaboradorResponseDto>>> GetAll()
    {
        var colaboradores = await _context.Colaboradores
            .Select(c => new ColaboradorResponseDto
            {
                Id = c.Id,
                Nome = c.Nome
            })
            .ToListAsync();

        return Ok(colaboradores);
    }

    // GET /api/colaboradores/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ColaboradorResponseDto>> GetById(int id)
    {
        var colaborador = await _context.Colaboradores.FindAsync(id);

        if (colaborador is null)
            return NotFound(new { mensagem = $"Colaborador com Id {id} não encontrado." });

        return Ok(new ColaboradorResponseDto
        {
            Id = colaborador.Id,
            Nome = colaborador.Nome
        });
    }

    // POST /api/colaboradores
    [HttpPost]
    public async Task<ActionResult<ColaboradorResponseDto>> Create(ColaboradorCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome))
            return BadRequest(new { mensagem = "O campo Nome é obrigatório." });

        var colaborador = new Colaborador { Nome = dto.Nome };

        _context.Colaboradores.Add(colaborador);
        await _context.SaveChangesAsync();

        var response = new ColaboradorResponseDto
        {
            Id = colaborador.Id,
            Nome = colaborador.Nome
        };

        return CreatedAtAction(nameof(GetById), new { id = colaborador.Id }, response);
    }

    // PUT /api/colaboradores/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ColaboradorUpdateDto dto)
    {
        var colaborador = await _context.Colaboradores.FindAsync(id);
        if (colaborador is null)
            return NotFound(new { mensagem = $"Colaborador com Id {id} não encontrado." });

        if (string.IsNullOrWhiteSpace(dto.Nome))
            return BadRequest(new { mensagem = "O campo Nome é obrigatório." });

        colaborador.Nome = dto.Nome;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/colaboradores/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var colaborador = await _context.Colaboradores.FindAsync(id);
        if (colaborador is null)
            return NotFound(new { mensagem = $"Colaborador com Id {id} não encontrado." });

        var possuiPresencas = await _context.Presencas
            .AnyAsync(p => p.ColaboradorId == id);

        if (possuiPresencas)
            return Conflict(new
            {
                mensagem = "Não é possível excluir este colaborador pois ele possui presenças registradas em workshops."
            });

        _context.Colaboradores.Remove(colaborador);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}