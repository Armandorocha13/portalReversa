package br.com.ffa.automation;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class Connectutomation {

    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("Uso: java Connectutomation <caminho_do_arquivo>");
            return;
        }

        String filePath = args[0];
        File file = new File(filePath);
        if (!file.exists()) {
            System.err.println("Erro: Arquivo não encontrado em " + filePath);
            return;
        }

        String fileName = file.getName();
        String fileNameNoExt = fileName.substring(0, fileName.lastIndexOf("."));

        // Lógica de extração da cidade (ex: S1M5_FFA_CAMPOS_DOS_GOYTACAZES)
        String city = extractCityFromFileName(fileNameNoExt);

        // Configura o ChromeDriver
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        
        WebDriver driver = new ChromeDriver(options);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        try {
            System.out.println("Acessando Connect Control...");
            driver.get("https://ffa.controlservices.com.br/login");

            // 1. Login
            System.out.println("Realizando login...");
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email"))).sendKeys("thiagosouza@ffainfraestrutura.com.br");
            driver.findElement(By.id("password")).sendKeys("Thiago@3540");
            driver.findElement(By.className("btn-login")).click();

            // 2. Navegação
            System.out.println("Navegando para Reversa...");
            wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("a.nav-link[href*='/estoque']"))).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("a.dropdown-toggle"))).click(); // Manutenção
            wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("a[href*='/estoque/reversa']"))).click();

            // 3. Preenchimento do Formulário
            System.out.println("Preenchendo formulário para o arquivo: " + fileName);

            // Data Saída
            String today = LocalDate.now().format(DateTimeFormatter.ofPattern("ddMMyyyy"));
            WebElement dataField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//label[contains(text(), 'Data Saida')]/following-sibling::input")));
            dataField.sendKeys(today);

            // Status: Transito Reversa
            Select statusSelect = new Select(driver.findElement(By.xpath("//label[contains(text(), 'Status')]/following-sibling::select")));
            statusSelect.selectByVisibleText("Transito Reversa");

            // Lote e Nota Fiscal (Nome do arquivo)
            driver.findElement(By.xpath("//label[contains(text(), 'Lote')]/following-sibling::input")).sendKeys(fileNameNoExt);
            driver.findElement(By.xpath("//label[contains(text(), 'Nota Fiscal')]/following-sibling::input")).sendKeys(fileNameNoExt);

            // Cidades
            Select cidadeSelect = new Select(driver.findElement(By.xpath("//label[contains(text(), 'Cidades')]/following-sibling::select")));
            // Tenta selecionar pela cidade extraída (ajuste se o nome no combo for diferente)
            selectOptionByPartialText(cidadeSelect, city);

            // Grupo (Base) - Lógica Condicional
            Select grupoSelect = new Select(driver.findElement(By.xpath("//label[contains(text(), 'Grupo')]/following-sibling::select")));
            String basePrefix = isAdesaoCity(city) ? "ADESÃO " : "DESCONEXÃO ";
            String targetBase = basePrefix + city;
            System.out.println("Selecionando Base: " + targetBase);
            selectOptionByPartialText(grupoSelect, targetBase);

            // Upload do Arquivo
            System.out.println("Fazendo upload do arquivo...");
            driver.findElement(By.xpath("//label[contains(text(), 'Arquivo')]/following-sibling::input")).sendKeys(file.getAbsolutePath());

            // 4. Enviar
            System.out.println("Enviando...");
            // driver.findElement(By.xpath("//button[contains(text(), 'ENVIAR')]")).click();

            System.out.println("Automação concluída com sucesso!");
            Thread.sleep(5000); // Para visualização final

        } catch (Exception e) {
            System.err.println("Erro na automação: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // driver.quit();
        }
    }

    private static String extractCityFromFileName(String fileName) {
        // Ex: S1M5_FFA_CAMPOS_DOS_GOYTACAZES -> CAMPOS DOS GOYTACAZES
        String[] parts = fileName.split("_");
        if (parts.length > 2) {
            StringBuilder cityName = new StringBuilder();
            for (int i = 2; i < parts.length; i++) {
                cityName.append(parts[i]).append(i == parts.length - 1 ? "" : " ");
            }
            return cityName.toString().toUpperCase();
        }
        return fileName.toUpperCase();
    }

    private static boolean isAdesaoCity(String city) {
        String c = city.toUpperCase();
        return c.contains("CURITIBA") || c.contains("SERRA") || c.contains("CAMPO GRANDE");
    }

    private static void selectOptionByPartialText(Select select, String text) {
        for (WebElement option : select.getOptions()) {
            if (option.getText().toUpperCase().contains(text.toUpperCase())) {
                select.selectByVisibleText(option.getText());
                return;
            }
        }
        System.err.println("Aviso: Opção '" + text + "' não encontrada no menu.");
    }
}
