namespace WorkshopTracker.API.DTOs;

public class ColaboradorCreateDto
{
    public string Nome {get; set;} = string.Empty;
}

public class ColaboradorUpdateDto
{
    public string Nome {get; set;} = string.Empty;
}

public class ColaboradorResponseDto
{
    public int Id {get; set;}
    public string Nome {get; set;} = string.Empty;
}