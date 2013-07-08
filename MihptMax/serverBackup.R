
# Sys.setlocale('LC_ALL','C') 

library(plyr)

shinyServer(function(input, output) {
 
  dat <- reactive({
    inFile <- input$files[[1, 'datapath']]
    fileNames<-input$files[,'datapath']
    tempTable<-read.csv(inFile, skip=input$toplines, header=input$header, sep=input$sep, na.strings=c("NA",input$nas),quote=input$quote)
    #out <- as.data.frame(sapply(tempTable,gsub,pattern="µ",replacement="u"))
    tempTable
    names(fileNames)<-fileNames
    full_data <- ldply(fileNames, read.table, header=input$header, sep=input$sep)
    sample <- full_data[1:50,]
  })
  
  output$contents <- renderTable({
    
    inFile <- input$files[[1, 'datapath']]
    
    if (is.null(input$inFile))
      return(NULL)
    
    tempTable<-read.csv(inFile, skip=input$toplines, header=input$header, sep=input$sep, na.strings=c("NA",input$nas),quote=input$quote)
    #out <- as.data.frame(sapply(tempTable,gsub,pattern="µ",replacement="u"))
    tempTable
  })
  

  
  output$transformedContents <- renderTable({
    fileNames<-input$files[,'datapath']
    names(fileNames)<-fileNames
    full_data <- ldply(fileNames, read.table, header=input$header, sep=input$sep)
    full_data
  })
  
  output$dlTransformedData <- downloadHandler({

    filename = "download.csv"
    content = function(file){
      write.csv(full_data, file)
    }
    
  })

    
})