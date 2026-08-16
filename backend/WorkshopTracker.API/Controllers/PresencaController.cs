using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkshopTracker.API.Data;
using WorkshopTracker.API.DTOs;
using WorkshopTracker.API.Models;

namespace WorkshopTracker.API.Controllers;

[ApiController]
[Route("api/presencas")]
[Authorize]
public class PresencaController : ControllerBase
{
    private readonly AppDbContext _context;

    public PresencaController(AppDbContext context)
    {
        _context = context;
    }

    // POST /api/presencas
    [HttpPost]
    public async Task<ActionResult<PresencaResponseDto>> Create(PresencaCreateDto dto)
    {
        var workshop = await _context.Workshops.FindAsync(dto.WorkshopId);
        if (workshop is null)
            return NotFound(new { mensagem = $"Workshop com Id {dto.WorkshopId} não encontrado." });

        var colaborador = await _context.Colaboradores.FindAsync(dto.ColaboradorId);
        if (colaborador is null)
            return NotFound(new { mensagem = $"Colaborador com Id {dto.ColaboradorId} não encontrado." });

        var jaExiste = await _context.Presencas.AnyAsync(p =>
            p.WorkshopId == dto.WorkshopId && p.ColaboradorId == dto.ColaboradorId);

        if (jaExiste)
            return Conflict(new
            {
                mensagem = "Este colaborador já está registrado como presente neste workshop."
            });

        var presenca = new Presenca
        {
            WorkshopId = dto.WorkshopId,
            ColaboradorId = dto.ColaboradorId,
            DataRegistro = DateTime.UtcNow
        };

        _context.Presencas.Add(presenca);
        await _context.SaveChangesAsync();

        var response = new PresencaResponseDto
        {
            Id = presenca.Id,
            WorkshopId = workshop.Id,
            WorkshopNome = workshop.Nome,
            ColaboradorId = colaborador.Id,
            ColaboradorNome = colaborador.Nome,
            DataRegistro = presenca.DataRegistro
        };

        return CreatedAtAction(nameof(Create), new { id = presenca.Id }, response);
    }

    // DELETE /api/presencas/{workshopId}/{colaboradorId}
    [HttpDelete("{workshopId}/{colaboradorId}")]
    public async Task<IActionResult> Delete(int workshopId, int colaboradorId)
    {
        var presenca = await _context.Presencas.FirstOrDefaultAsync(p =>
        p.WorkshopId == workshopId && p.ColaboradorId == colaboradorId);

        if (presenca is null)
            return NotFound(new {mensagem = "Presença não encontrada para este workshop e colaborador."});
        
        _context.Presencas.Remove(presenca);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}